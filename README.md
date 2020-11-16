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