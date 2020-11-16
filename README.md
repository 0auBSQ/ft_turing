# ft_turing
JSON Turing machine emulator in Javascript

## Important information

- This project is proposed by 42
- The program mostly uses Javascript's functional paradigm (Only one imperative while since Node doesn't support TCO (Tail Call Optimisation))
- The program mostly uses ES6 arrow functions
- The challenge here was to complete this project in a single small file
- This program contains weak type abuse (Mostly considering that undefined/null in JS are falsy values)

## Requirements

Install the dependencies using
```
npm install
```

## Usage

```
usage: node turing.js [-h] jsonfile input

positional arguments:
        jsonfile        json description of the machine

        input           input of the machine

optional arguments:
        -h, --help      show this help message and exit
```

## Specifications

- The tape is semi-infinite (auto-extends on the right side)
- All excedent arguments in the JSON are ignored
- Duplicate transitions are ignored
- The alphabet also contains work alphabet (mostly y and n), which can cause errors if you write them in the input 
- Blocking the machine (attempting an undefined transition) exit the program and refuses the output
- The final tape state is displayed if output is accepted (n included)

## Functions

JSON parsing :
```
jsonData : string -> object
```
Args :
```
usage : void -> undefined
invalid_argument : string -> undefined 
process_args : int, string -> bool
```
Transitions parsing :
```
member_keywords : object -> bool 
member_types : object -> bool
member_links : object, object -> bool 
sanitize_member : object, object -> bool 
sanitize_members : object, array -> bool 
transitions_states : object, object -> bool 
transitions_arrays : object -> bool 
transitions_members : object, object -> bool 
sanitize_transitions : object -> bool 
```
Machine parsing :
```
invalid_machine : void -> undefined 
mandatory_keywords : object -> bool 
process_types : object -> bool 
blank_in_alf : object -> bool 
initial_in_states : object -> bool 
finals_in_states : object -> bool 
alphabet_are_char : array -> bool 
sanitize_machine : object -> bool 
```
Input parsing :
```
invalid_input : void -> undefined
sanitize_input : object, string -> bool 
```
Displayables :
```
display_step : string, object -> undefined 
transitions_info : object -> undefined
machine_info : object -> undefined 
```
Processing :
```
print_tape : string, int -> char 
print_step : object, int, string, object -> undefined
get_step : object, string, int, int, object -> object
check_idx : int -> bool
expand_input : int, int -> int
handle_pattern : array -> bool
process_turing : object, string, int, object -> undefined 
```