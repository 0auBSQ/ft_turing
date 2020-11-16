const fs = require("fs");
const _ = require("lodash");
// JSON parsing method
const jsonData = (filename) => JSON.parse(fs.readFileSync(filename));
// Args and usage methods
const argv = process.argv.slice(2);
const argc = argv.length;
const usage = () => console.log("usage: node turing.js [-h] jsonfile input\n\npositional arguments:\n\tjsonfile\tjson description of the machine\n\n\tinput\t\tinput of the machine\n\noptional arguments:\n\t-h, --help\tshow this help message and exit") || process.exit(0);
const invalid_argument = (arg) => console.log("Invalid argument : " + arg) || usage();
const process_args = (argc, argv) => (argc == 2) || (argc == 3 && ["-h","--help"].includes(argv[0]) && usage()) || (argc == 3 && !["-h","--help"].includes(argv[0]) && invalid_argument(argv[0])) || (argc != 2 && argc != 3 && usage());
// Sanitize transitions method
const member_keywords = (member) => (member.hasOwnProperty('read') && member.hasOwnProperty('to_state') && member.hasOwnProperty('write') && member.hasOwnProperty('action'));
const member_types = (member) => (typeof member.read === 'string' && typeof member.to_state === 'string' && typeof member.write === 'string' && typeof member.action === 'string');
const member_links = (machine, member) => (machine.alphabet.includes(member.read) && machine.alphabet.includes(member.write) && ["LEFT", "RIGHT"].includes(member.action) && machine.states.includes(member.to_state));
const sanitize_member = (machine, member) => (member_keywords(member) && member_types(member) && member_links(machine, member));
const sanitize_members = (machine, transition) => transition.every((member) => sanitize_member(machine, member));
const transitions_states = (machine, transitions) => _.isEqual(Object.keys(transitions).concat(machine.finals).sort(), [...machine.states].sort());
const transitions_arrays = (transitions) => Object.values(transitions).every((transition) => Array.isArray(transition));
const transitions_members = (machine, transitions) => Object.values(transitions).every((transition) => sanitize_members(machine, transition));
const sanitize_transitions = (machine) => (transitions_states(machine, machine.transitions) &&  transitions_arrays(machine.transitions) && transitions_members(machine, machine.transitions));
// Sanitize machine methods
const invalid_machine = () => console.error("Wrongly formatted machine") || process.exit(1); 
const mandatory_keywords = (machine) => (machine.hasOwnProperty('name') && machine.hasOwnProperty('alphabet') && machine.hasOwnProperty('blank') && machine.hasOwnProperty('states') && machine.hasOwnProperty('initial') && machine.hasOwnProperty('finals') && machine.hasOwnProperty('transitions'));
const process_types = (machine) => (Array.isArray(machine.alphabet) && typeof machine.blank === 'string' && Array.isArray(machine.states) && Array.isArray(machine.finals) && typeof machine.initial === 'string' && typeof machine.transitions === 'object' && machine.transitions !== null)
const blank_in_alf = (machine) => machine.alphabet.includes(machine.blank);
const initial_in_states = (machine) => machine.states.includes(machine.initial);
const finals_in_states = (machine) => machine.finals.every((e) => {return machine.states.indexOf(e) !== -1;});
const alphabet_are_char = (alphabet) => alphabet.every((letter) => (typeof letter === 'string' && letter.length === 1));
const sanitize_machine = (machine) => (mandatory_keywords(machine) && process_types(machine) && blank_in_alf(machine) && initial_in_states(machine) && finals_in_states(machine) && sanitize_transitions(machine) && alphabet_are_char(machine.alphabet)) ? true : invalid_machine();
// Sanitize input
const invalid_input = () => console.error("Wrongly formatted input") || process.exit(1); 
const sanitize_input = (machine, input) => [...input].every((c) => (c !== machine.blank && machine.alphabet.includes(c))) ? true : invalid_input();
// Displayables
const display_step = (name, member) => console.log("(" + name + ", " + member.read + ") -> (" + member.to_state + ", " + member.write + ", " + member.action + ")");
const transitions_info = (transitions) => Object.entries(transitions).forEach(([name, members]) => members.forEach((member) => display_step(name, member)));
const machine_info = (machine) => console.log("**************************************************************************************************************") || console.log("*\t\t\t\t\t" + machine.name + "\t\t\t\t\t*") || console.log("**************************************************************************************************************") || console.log("Alphabet : [ " + machine.alphabet + " ]") || console.log("States :  [ " + machine.states + " ]") || console.log("Initial : " + machine.initial) || console.log("Finals : [ " + machine.finals + " ]") || transitions_info(machine.transitions) || console.log("**************************************************************************************************************") || true;
// Processing
const print_tape = (input, idx) => (input.substring(0, idx) + "\033[30m\033[107m" + input.substring(idx, idx + 1) + "\033[39m\033[49m" + input.substring(idx + 1)); 
const print_step = (step, idx, input, member) => console.log("[" + print_tape(input, idx) + "] (" + step + ", " + member.read + ") -> (" + member.to_state + ", " + member.write + ", " + member.action + ")");
const get_step = (machine, input, idx, size, step) => machine.transitions[step].filter((member) => {return member.read === input[idx]});
const check_idx = (idx) => (idx < 0) ? (console.error("Tape index under 0, exiting") || process.exit(1)) : true;
const expand_input = (idx, size) => (idx >= size) ? size + 2 : size;
const handle_pattern = (match) => (match.length < 1) ? (console.error("No method to process the current action, exiting") || process.exit(1)) : true;
// Node.js doesn't handle tail call optimisation, so I use a while loop to avoid stack overflow issues
const process_turing = (machine, input, idx, step) => {
	while (!machine.finals.includes(step)) {
		try {
			let input_size = input.length;
			check_idx(idx);
			input = input.padEnd(expand_input(idx, input_size), machine.blank);
			let member_match = get_step(machine, input, idx, input_size, step);
			handle_pattern(member_match);
			let member = member_match[0];
			print_step(step, idx, input, member);
			input = input.substring(0, idx) + member.write + input.substring(idx + 1);
			step = member.to_state;
			idx += (member.action === "RIGHT") ? 1 : -1;
		} catch (e) {
			console.error("Memory issue : " + e);
			process.exit(1);
		}
	}
	console.log("Result : [" + input + "]");
}
// Global parsing
let machine;
let input;
process_args(argc, argv);
try {
	machine = jsonData(argv[0]);
	input = argv[1];
	sanitize_machine(machine);
	sanitize_input(machine, input);
} catch (e) {
	console.error("Failed to process machine file : " + e);
	process.exit(1);
}
// Print machine
machine_info(machine);
input = input.padEnd(input.length + 10, machine.blank);
// Turing process 
process_turing(machine, input, 0, machine.initial);