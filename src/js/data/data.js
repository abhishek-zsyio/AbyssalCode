export const TOPICS = [
  {
    id: 'ds', label: 'Data Structures', icon: 'database',
    color: '#8b5cf6',
    bg: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))',
    problems: [
      {
        id: 'ds-1', title: 'Even Number Filter', difficulty: 'easy', xp: 30,
        languages: ['python', 'js'],
        desc: 'Given a list of integers, return a new list/array containing only the even numbers.',
        examples: [
          { input: '[1, 2, 3, 4, 5]', output: '[2, 4]', explanation: '2 and 4 are the only even numbers.' },
          { input: '[1, 3, 5]', output: '[]' }
        ],
        constraints: [
          '0 <= lst.length <= 10^3',
          '-10^4 <= lst[i] <= 10^4'
        ],
        hint: 'Python: list comprehension `[x for x in lst if x % 2 == 0]`. JS: `arr.filter(x => x % 2 === 0)`',
        initialCode: 'def filter_even(lst):\n    # Your code here\n    pass\n',
        testCode: `assert filter_even([1, 2, 3, 4, 5]) == [2, 4]
assert filter_even([2, 4, 6]) == [2, 4, 6]
assert filter_even([1, 3, 5]) == []
assert filter_even([]) == []
assert filter_even([-2, -1, 0, 1, 2]) == [-2, 0, 2]`,
        initialCodeJs: 'function filterEven(arr) {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
assert(JSON.stringify(filterEven([1,2,3,4,5])) === '[2,4]', 'Test 1');
assert(JSON.stringify(filterEven([2,4,6])) === '[2,4,6]', 'Test 2');
assert(JSON.stringify(filterEven([1,3,5])) === '[]', 'Test 3');
assert(JSON.stringify(filterEven([])) === '[]', 'Test 4');
assert(JSON.stringify(filterEven([-2,-1,0,1,2])) === '[-2,0,2]', 'Test 5');`,
        solutionPy: 'def filter_even(lst):\n    return [x for x in lst if x % 2 == 0]',
        solutionJs: 'function filterEven(arr) {\n  return arr.filter(x => x % 2 === 0);\n}'
      },
      {
        id: 'ds-2', title: 'Unique Elements', difficulty: 'easy', xp: 40,
        languages: ['python', 'js'],
        desc: 'Return a new list/array of unique elements from the input, preserving original order of appearance.',
        examples: [
          { input: '[1, 2, 2, 3, 1, 4]', output: '[1, 2, 3, 4]' },
          { input: '["a", "b", "a", "c"]', output: '["a", "b", "c"]' }
        ],
        constraints: [
          '0 <= lst.length <= 1000',
          'Elements can be integers or strings.'
        ],
        hint: 'Python: `dict.fromkeys(lst)`. JS: `[...new Set(arr)]`',
        initialCode: 'def unique_elements(lst):\n    # Your code here\n    pass\n',
        testCode: `assert unique_elements([1, 2, 2, 3, 1, 4]) == [1, 2, 3, 4]
assert unique_elements([5, 5, 5]) == [5]
assert unique_elements([]) == []
assert unique_elements(['a', 'b', 'a', 'c']) == ['a', 'b', 'c']
assert unique_elements([3, 1, 2, 1, 3]) == [3, 1, 2]`,
        initialCodeJs: 'function uniqueElements(arr) {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
assert(JSON.stringify(uniqueElements([1,2,2,3,1,4])) === '[1,2,3,4]', 'Test 1');
assert(JSON.stringify(uniqueElements([5,5,5])) === '[5]', 'Test 2');
assert(JSON.stringify(uniqueElements([])) === '[]', 'Test 3');
assert(JSON.stringify(uniqueElements(['a','b','a','c'])) === '["a","b","c"]', 'Test 4');
assert(JSON.stringify(uniqueElements([3,1,2,1,3])) === '[3,1,2]', 'Test 5');`,
        solutionPy: 'def unique_elements(lst):\n    return list(dict.fromkeys(lst))',
        solutionJs: 'function uniqueElements(arr) {\n  return [...new Set(arr)];\n}'
      },
      {
        id: 'ds-3', title: 'Dictionary Merger', difficulty: 'easy', xp: 40,
        languages: ['python', 'js'],
        desc: 'Merge two objects/dicts. If both contain the same key, the value from the second should override the first.',
        examples: [
          { input: 'd1 = {"a": 1, "b": 2}, d2 = {"b": 3, "c": 4}', output: '{"a": 1, "b": 3, "c": 4}' }
        ],
        constraints: [
          'At most 100 keys.',
          'Keys are strings, values are integers.'
        ],
        hint: 'Python: `{**d1, **d2}`. JS: `{...d1, ...d2}`',
        initialCode: 'def merge_dicts(d1, d2):\n    # Your code here\n    pass\n',
        testCode: `assert merge_dicts({'a': 1, 'b': 2}, {'b': 3, 'c': 4}) == {'a': 1, 'b': 3, 'c': 4}
assert merge_dicts({}, {'a': 1}) == {'a': 1}
assert merge_dicts({'a': 1}, {}) == {'a': 1}
assert merge_dicts({'x': 10}, {'x': 20}) == {'x': 20}`,
        initialCodeJs: 'function mergeDicts(d1, d2) {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
assert(eq(mergeDicts({a:1,b:2},{b:3,c:4}), {a:1,b:3,c:4}), 'Test 1');
assert(eq(mergeDicts({},{a:1}), {a:1}), 'Test 2');
assert(eq(mergeDicts({a:1},{}), {a:1}), 'Test 3');
assert(eq(mergeDicts({x:10},{x:20}), {x:20}), 'Test 4');`,
        solutionPy: 'def merge_dicts(d1, d2):\n    return {**d1, **d2}',
        solutionJs: 'function mergeDicts(d1, d2) {\n  return {...d1, ...d2};\n}'
      },
      {
        id: 'ds-4', title: 'List Flattener', difficulty: 'medium', xp: 60,
        languages: ['python', 'js'],
        desc: 'Flatten a 2D list/array into a 1D list/array.',
        examples: [
          { input: '[[1, 2], [3], [4, 5]]', output: '[1, 2, 3, 4, 5]' }
        ],
        constraints: [
          '0 <= lst.length <= 100',
          '0 <= inner_list.length <= 100'
        ],
        hint: 'Python: `[val for sub in lst for val in sub]`. JS: `arr.flat()` or `[].concat(...arr)`',
        initialCode: 'def flatten(lst):\n    # Your code here\n    pass\n',
        testCode: `assert flatten([[1, 2], [3, 4]]) == [1, 2, 3, 4]
assert flatten([[1], [], [2, 3]]) == [1, 2, 3]
assert flatten([]) == []
assert flatten([[], [], []]) == []`,
        initialCodeJs: 'function flatten(arr) {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
assert(JSON.stringify(flatten([[1,2],[3,4]])) === '[1,2,3,4]', 'Test 1');
assert(JSON.stringify(flatten([[1],[],[2,3]])) === '[1,2,3]', 'Test 2');
assert(JSON.stringify(flatten([])) === '[]', 'Test 3');
assert(JSON.stringify(flatten([[],[],[]])) === '[]', 'Test 4');`
      },
      {
        id: 'ds-5', title: 'Matrix Transpose', difficulty: 'hard', xp: 80,
        languages: ['python', 'js'],
        desc: 'Given a 2D matrix (array of arrays), return its transpose (rows become columns).',
        examples: [
          { input: '[[1, 2], [3, 4]]', output: '[[1, 3], [2, 4]]' }
        ],
        hint: 'Python: `zip(*matrix)`. JS: use `matrix[0].map((_, i) => matrix.map(row => row[i]))`',
        initialCode: 'def transpose(matrix):\n    # Your code here\n    pass\n',
        testCode: `assert transpose([[1, 2], [3, 4]]) == [[1, 3], [2, 4]]
assert transpose([[1, 2, 3], [4, 5, 6]]) == [[1, 4], [2, 5], [3, 6]]
assert transpose([[1]]) == [[1]]`,
        initialCodeJs: 'function transpose(matrix) {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
assert(JSON.stringify(transpose([[1,2],[3,4]])) === '[[1,3],[2,4]]', 'Test 1');
assert(JSON.stringify(transpose([[1,2,3],[4,5,6]])) === '[[1,4],[2,5],[3,6]]', 'Test 2');
assert(JSON.stringify(transpose([[1]])) === '[[1]]', 'Test 3');`
      },
      {
        id: 'ds-6', title: 'Character Frequency', difficulty: 'easy', xp: 40,
        languages: ['python', 'js'],
        desc: 'Return an object/dict containing the frequency of each character in string `s`.',
        examples: [
          { input: '"aab"', output: '{"a": 2, "b": 1}' }
        ],
        hint: 'Python: `collections.Counter`. JS: loop and use `obj[ch] = (obj[ch] || 0) + 1`',
        initialCode: 'def char_freq(s):\n    # Your code here\n    pass\n',
        testCode: `assert char_freq("aab") == {'a': 2, 'b': 1}
assert char_freq("") == {}
assert char_freq("apple") == {'a': 1, 'p': 2, 'l': 1, 'e': 1}`,
        initialCodeJs: 'function charFreq(s) {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
const eq = (a, b) => JSON.stringify(Object.fromEntries(Object.entries(a).sort())) === JSON.stringify(Object.fromEntries(Object.entries(b).sort()));
assert(eq(charFreq('aab'), {a:2,b:1}), 'Test 1');
assert(eq(charFreq(''), {}), 'Test 2');
assert(eq(charFreq('apple'), {a:1,p:2,l:1,e:1}), 'Test 3');`
      },
      {
        id: 'ds-7', title: 'Count Occurrences', difficulty: 'easy', xp: 30,
        languages: ['python', 'js'],
        desc: 'Return an object (JS) or dictionary (Python) showing how many times each item appears in the given list/array.',
        hint: 'Python: Use a simple loop or `collections.Counter`. JS: use a basic object and `count[item] = (count[item] || 0) + 1`.',
        initialCode: 'def count_occurrences(lst):\n    # Your code here\n    pass\n',
        testCode: `assert count_occurrences([1, 2, 2, 3, 1]) == {1: 2, 2: 2, 3: 1}
assert count_occurrences([]) == {}`,
        initialCodeJs: 'function countOccurrences(arr) {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
const eq = (a, b) => JSON.stringify(Object.fromEntries(Object.entries(a).sort())) === JSON.stringify(Object.fromEntries(Object.entries(b).sort()));
assert(eq(countOccurrences([1,2,2,3,1]), {'1':2,'2':2,'3':1}), 'Test 1');
assert(eq(countOccurrences([]), {}), 'Test 2');`
      },
      {
        id: 'ds-8', title: 'Two Sum', difficulty: 'medium', xp: 70,
        languages: ['python', 'js'],
        desc: 'Given an array of integers and a target, return indices of the two numbers that add up to target.',
        examples: [
          { input: '[2,7,11,15], target=9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9.' },
          { input: '[3,2,4], target=6', output: '[1,2]' }
        ],
        constraints: [
          '2 <= nums.length <= 10^4',
          'Only one valid answer exists.'
        ],
        hint: 'Use a hash map to store seen values and their indices.',
        initialCode: 'def two_sum(nums, target):\n    # Your code here\n    pass\n',
        testCode: `assert two_sum([2, 7, 11, 15], 9) == [0, 1]
assert two_sum([3, 2, 4], 6) == [1, 2]
assert two_sum([3, 3], 6) == [0, 1]
assert two_sum([-1, -2, -3, -4, -5], -8) == [2, 4]`,
        initialCodeJs: 'function twoSum(nums, target) {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
assert(JSON.stringify(twoSum([2,7,11,15],9)) === '[0,1]', 'Test 1');
assert(JSON.stringify(twoSum([3,2,4],6)) === '[1,2]', 'Test 2');
assert(JSON.stringify(twoSum([3,3],6)) === '[0,1]', 'Test 3');
assert(JSON.stringify(twoSum([-1,-2,-3,-4,-5],-8)) === '[2,4]', 'Test 4');`
      },
      {
        id: 'ds-9', title: 'Group Anagrams', difficulty: 'hard', xp: 90,
        languages: ['python', 'js'],
        desc: 'Group a list/array of strings into sublists/sub-arrays of anagrams.',
        hint: 'Python: `tuple(sorted(word))` as key. JS: `word.split(\'\').sort().join(\'\')` as key.',
        initialCode: 'def group_anagrams(words):\n    # Your code here\n    pass\n',
        testCode: `result = group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"])
result_sorted = sorted([sorted(g) for g in result])
expected = sorted([sorted(g) for g in [["eat","tea","ate"],["tan","nat"],["bat"]]])
assert result_sorted == expected, f"Got {result_sorted}"`,
        initialCodeJs: 'function groupAnagrams(words) {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
const result = groupAnagrams(['eat','tea','tan','ate','nat','bat']);
const sorted = result.map(g => [...g].sort()).sort((a,b) => a[0].localeCompare(b[0]));
const expected = [['ate','eat','tea'],['bat'],['nat','tan']].map(g => [...g].sort()).sort((a,b) => a[0].localeCompare(b[0]));
assert(JSON.stringify(sorted) === JSON.stringify(expected), 'Grouping mismatch');`
      },
      {
        id: 'ds-10', title: 'Rotate List', difficulty: 'medium', xp: 60,
        languages: ['python', 'js'],
        desc: 'Rotate a list/array to the right by `k` positions.',
        hint: 'Python: `lst[-k:] + lst[:-k]`. JS: `[...arr.slice(-k), ...arr.slice(0,-k)]`',
        initialCode: 'def rotate(lst, k):\n    # Your code here\n    pass\n',
        testCode: `assert rotate([1, 2, 3, 4, 5], 2) == [4, 5, 1, 2, 3]
assert rotate([1, 2, 3], 0) == [1, 2, 3]
assert rotate([1, 2, 3], 3) == [1, 2, 3]
assert rotate([], 5) == []`,
        initialCodeJs: 'function rotate(arr, k) {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
assert(JSON.stringify(rotate([1,2,3,4,5],2)) === '[4,5,1,2,3]', 'Test 1');
assert(JSON.stringify(rotate([1,2,3],0)) === '[1,2,3]', 'Test 2');
assert(JSON.stringify(rotate([1,2,3],3)) === '[1,2,3]', 'Test 3');
assert(JSON.stringify(rotate([],5)) === '[]', 'Test 4');`
      }
    ]
  },
  {
    id: 'oop', label: 'Object-Oriented', icon: 'layers',
    color: '#22d3ee',
    bg: 'linear-gradient(135deg, rgba(34,211,238,0.2), rgba(34,211,238,0.05))',
    problems: [
      {
        id: 'oop-1', title: 'Bank Account Pro', difficulty: 'easy', xp: 30,
        languages: ['python', 'js'],
        desc: 'Implement a `BankAccount` class that tracks a balance. It can deposit funds and withdraw if there are sufficient funds.',
        examples: [
          { input: 'acc = BankAccount(); acc.deposit(100); acc.withdraw(30);', output: 'acc.balance == 70', explanation: 'Initial 0 + 100 - 30 = 70.' },
          { input: 'acc = BankAccount(); acc.withdraw(10);', output: 'False', explanation: 'Insufficient funds.' }
        ],
        constraints: [
          'Balance starts at 0.',
          'deposit(amount): amount > 0',
          'withdraw(amount): returns True/true if sufficient funds, else False/false.'
        ],
        hint: 'Use a variable like `self.balance` (Python) or `this.balance` (JS). Ensure `withdraw` returns `False` if `amount > self.balance`.',
        initialCode: 'class BankAccount:\n    def __init__(self):\n        self.balance = 0\n\n    def deposit(self, amount):\n        pass\n\n    def withdraw(self, amount):\n        pass\n',
        testCode: `acc = BankAccount()
assert acc.balance == 0
acc.deposit(100)
assert acc.balance == 100
assert acc.withdraw(50) == True
assert acc.balance == 50
assert acc.withdraw(100) == False
assert acc.balance == 50`,
        initialCodeJs: 'class BankAccount {\n  constructor() {\n    this.balance = 0;\n  }\n  deposit(amount) {\n    // Your code here\n  }\n  withdraw(amount) {\n    // Your code here\n  }\n}\n',
        testCodeJs: `const acc = new BankAccount();
assert(acc.balance === 0, 'Initial balance');
acc.deposit(100);
assert(acc.balance === 100, 'After deposit');
assert(acc.withdraw(50) === true, 'Withdraw success');
assert(acc.balance === 50, 'After withdraw');
assert(acc.withdraw(100) === false, 'Withdraw fail');
assert(acc.balance === 50, 'Balance unchanged on fail');`,
        solutionPy: 'class BankAccount:\n    def __init__(self):\n        self.balance = 0\n\n    def deposit(self, amount):\n        self.balance += amount\n\n    def withdraw(self, amount):\n        if amount <= self.balance:\n            self.balance -= amount\n            return True\n        return False',
        solutionJs: 'class BankAccount {\n  constructor() {\n    this.balance = 0;\n  }\n  deposit(amount) {\n    this.balance += amount;\n  }\n  withdraw(amount) {\n    if (amount <= this.balance) {\n      this.balance -= amount;\n      return true;\n    }\n    return false;\n  }\n}'
      },
      {
        id: 'oop-2', title: 'Smart Animal Inheritance', difficulty: 'easy', xp: 40,
        languages: ['python', 'js'],
        desc: 'Create a base class `Animal` and a subclass `Dog`. `Animal.speak()` returns `"..."`, `Dog.speak()` returns `"Woof!"`.',
        examples: [
          { input: 'new Dog().speak()', output: '"Woof!"' }
        ],
        hint: 'In Python, remember to call `return "Woof!"` in the `Dog.speak` method. In JS, use `extends Animal` and override `speak()`.',
        testCode: `assert Animal().speak() == "..."
assert Dog().speak() == "Woof!"
assert isinstance(Dog(), Animal)`,
        initialCodeJs: 'class Animal {\n  speak() { return \'...\'; }\n}\n\nclass Dog extends Animal {\n  // Override speak()\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
assert(new Animal().speak() === '...', 'Animal.speak');
assert(new Dog().speak() === 'Woof!', 'Dog.speak');
assert(new Dog() instanceof Animal, 'Dog instanceof Animal');`
      },
      {
        id: 'oop-3', title: 'Temperature Validator', difficulty: 'medium', xp: 60,
        languages: ['python', 'js'],
        desc: 'Create a `Celsius` class. Its `temperature` property must reject values below absolute zero (-273.15°C) by throwing an error.',
        constraints: [
          'Python: raise ValueError("Temperature below absolute zero"). JS: throw new Error("Temperature below absolute zero").'
        ],
        hint: 'Python: Use `@property` and a setter to check the value. JS: Use `get` and `set` syntax.',
        initialCode: 'class Celsius:\n    def __init__(self, temperature=0):\n        self.temperature = temperature\n',
        testCode: `c = Celsius()
c.temperature = 37
assert c.temperature == 37
try:
    c.temperature = -300
    assert False, "Should raise ValueError"
except ValueError as e:
    assert str(e) == "Temperature below absolute zero"`,
        initialCodeJs: 'class Celsius {\n  constructor(temperature = 0) {\n    this._temperature = temperature;\n  }\n  get temperature() { return this._temperature; }\n  set temperature(value) {\n    // Validate and set\n  }\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
const c = new Celsius();
c.temperature = 37;
assert(c.temperature === 37, 'Set valid temp');
try {
  c.temperature = -300;
  assert(false, 'Should have thrown');
} catch(e) {
  assert(e.message === 'Temperature below absolute zero', 'Error message');
}`
      },
      {
        id: 'oop-4', title: 'Vector Math (+ Overload)', difficulty: 'medium', xp: 70,
        languages: ['python', 'js'],
        desc: 'Implement a `Point` class representing (x, y) coordinates. Support `+` addition (Python: `__add__`, JS: an `add()` method is fine).',
        examples: [
          { input: 'Point(1, 2) + Point(3, 4)  →  Point(4, 6)', output: 'x=4, y=6' }
        ],
        hint: 'Python: Implement `__add__(self, other)`. JS: Implement `add(other)`. Both should return a *new* instance.',
        testCode: `p1 = Point(1, 2)
p2 = Point(3, 4)
p3 = p1 + p2
assert p3.x == 4 and p3.y == 6
assert p1.x == 1 # Original should not change`,
        initialCodeJs: 'class Point {\n  constructor(x, y) {\n    this.x = x;\n    this.y = y;\n  }\n  add(other) {\n    // Return a new Point\n  }\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
const p1 = new Point(1, 2);
const p2 = new Point(3, 4);
const p3 = p1.add(p2);
assert(p3.x === 4 && p3.y === 6, 'Sum correct');
assert(p1.x === 1, 'Original unchanged');`
      },
      {
        id: 'oop-8', title: 'String Representation', difficulty: 'medium', xp: 70,
        languages: ['python', 'js'],
        hint: 'Python: `__str__` is for users, `__repr__` is for developers. JS: `toString` is the standard method for string conversions.',
        initialCode: 'class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n',
        testCode: `b = Book("Dune", "Frank Herbert")
assert str(b) == "Dune by Frank Herbert"
assert repr(b) == "Book('Dune', 'Frank Herbert')"`,
        initialCodeJs: 'class Book {\n  constructor(title, author) {\n    this.title = title;\n    this.author = author;\n  }\n  toString() {\n    // "Title by Author"\n  }\n  toRepr() {\n    // "Book(\'Title\', \'Author\')"\n  }\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
const b = new Book('Dune', 'Frank Herbert');
assert(b.toString() === 'Dune by Frank Herbert', 'toString');
assert(b.toRepr() === "Book('Dune', 'Frank Herbert')", 'toRepr');`
      },
      {
        id: 'oop-9', title: 'Abstract Shape Factory', difficulty: 'hard', xp: 90,
        languages: ['python', 'js'],
        desc: 'Define an abstract base class `Shape`. Subclasses must implement `area()`. Python: use `abc`. JS: throw from the base class.',
        constraints: [
          'Instantiating Shape directly must raise an error.'
        ],
        initialCode: 'from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    pass\n\nclass Rectangle(Shape):\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n',
        hint: 'Python: Inherit from `ABC` and use `@abstractmethod`. JS: Call `super()` in the constructor and throw an error in the base `area()` method.',
        testCode: `try:
    Shape()
    assert False, "Shape() should raise TypeError"
except TypeError:
    pass
r = Rectangle(3, 4)
assert r.area() == 12`,
        initialCodeJs: 'class Shape {\n  area() {\n    throw new Error(\'area() must be implemented\');\n  }\n}\n\nclass Rectangle extends Shape {\n  constructor(w, h) {\n    super();\n    this.w = w;\n    this.h = h;\n  }\n  // Implement area()\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
try {
  new Shape().area();
  assert(false, 'Should throw');
} catch(e) {
  assert(e.message === 'area() must be implemented', 'Base throws');
}
const r = new Rectangle(3, 4);
assert(r.area() === 12, 'Rectangle area');`
      },
      {
        id: 'oop-10', title: 'Mixin Pattern', difficulty: 'hard', xp: 100,
        languages: ['python', 'js'],
        desc: 'Create a `JSONMixin` class with a `toJson()` method that returns the object\'s properties as a JSON string. Mix it into a `User(name, age)` class.',
        hint: 'Python: `import json; return json.dumps(self.__dict__)`. JS: `JSON.stringify({name:this.name, age:this.age})`',
        initialCode: 'import json\n\nclass JSONMixin:\n    def to_json(self):\n        pass\n\nclass User(JSONMixin):\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n',
        testCode: `import json
u = User("Alice", 30)
data = json.loads(u.to_json())
assert data["name"] == "Alice"
assert data["age"] == 30`,
        initialCodeJs: 'class JSONMixin {\n  toJson() {\n    // Return JSON string of this object\'s own properties\n  }\n}\n\nclass User extends JSONMixin {\n  constructor(name, age) {\n    super();\n    this.name = name;\n    this.age = age;\n  }\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
const u = new User('Alice', 30);
const data = JSON.parse(u.toJson());
assert(data.name === 'Alice', 'name');
assert(data.age === 30, 'age');`
      }
    ]
  },
  {
    id: 'dec', label: 'Decorators', icon: 'package',
    color: '#fbbf24',
    bg: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05))',
    problems: [
      {
        id: 'dec-1', title: 'Basic Wrapper', difficulty: 'easy', xp: 30,
        languages: ['python'],
        desc: 'Write a decorator `add_exclamation` that appends `"!"` to the string returned by the decorated function.',
        hint: 'Inside the wrapper: `result = func(*args, **kwargs); return result + "!"`',
        initialCode: 'def add_exclamation(func):\n    def wrapper(*args, **kwargs):\n        pass  # Your code\n    return wrapper\n',
        testCode: `@add_exclamation
def greet(name):
    return "Hello " + name
assert greet("World") == "Hello World!"`
      },
      {
        id: 'dec-2', title: 'Call Counter', difficulty: 'easy', xp: 40,
        languages: ['python'],
        desc: 'Write `count_calls(func)` that counts how many times the wrapped function has been called. Store the count in `wrapper.calls`.',
        hint: 'Initialize `wrapper.calls = 0` before returning wrapper. Increment inside the wrapper each call.',
        initialCode: 'def count_calls(func):\n    def wrapper(*args, **kwargs):\n        pass  # Your code\n    return wrapper\n',
        testCode: `@count_calls
def do_nothing():
    pass
assert do_nothing.calls == 0
do_nothing()
do_nothing()
assert do_nothing.calls == 2`
      },
      {
        id: 'dec-3', title: 'Integer Validator', difficulty: 'medium', xp: 60,
        languages: ['python'],
        desc: 'Write `require_ints(func)` that raises `TypeError("Int required")` if any positional argument is not an integer.',
        hint: 'Loop through `args`. `if not isinstance(arg, int): raise TypeError("Int required")`',
        initialCode: 'def require_ints(func):\n    def wrapper(*args, **kwargs):\n        pass  # Your code\n    return wrapper\n',
        testCode: `@require_ints
def add(a, b):
    return a + b
assert add(2, 3) == 5
try:
    add(2, "3")
    assert False, "Should raise TypeError"
except TypeError:
    pass`
      },
      {
        id: 'dec-4', title: 'Smart Memoize', difficulty: 'hard', xp: 90,
        languages: ['python'],
        desc: 'Write a `memoize` decorator that caches the results of a function based on its arguments. If the function is called again with the same arguments, return the cached result instead of re-calculating.',
        examples: [
          { input: '@memoize\ndef expensive(n): return n*n\nexpensive(4); expensive(4);', output: '16 (second call uses cache)', explanation: 'The function body should only execute once for the same input.' }
        ],
        constraints: [
          'Support functions with multiple arguments.',
          'The cache should be unique to the decorated function.'
        ],
        hint: 'Use a dictionary `cache` and the arguments as keys.',
        initialCode: 'def memoize(func):\n    cache = {}\n    def wrapper(*args):\n        # Your code here\n        pass\n    return wrapper\n',
        testCode: `calls = 0
@memoize
def slow_add(a, b):
    global calls
    calls += 1
    return a + b
assert slow_add(1, 2) == 3
assert calls == 1
assert slow_add(1, 2) == 3
assert calls == 1, "Should use cache on second call"
assert slow_add(2, 3) == 5
assert calls == 2`
      },
      {
        id: 'dec-7', title: 'The Retry Factory', difficulty: 'hard', xp: 100,
        languages: ['python'],
        desc: 'Create a decorator factory `retry(times)` that will attempt to run a function up to `times` if it raises an exception. If it still fails after `times` attempts, re-raise the final exception.',
        examples: [
          { input: '@retry(times=3)\ndef flaky(): ...', output: 'success after 3 attempts' }
        ],
        initialCode: 'def retry(times=3):\n    # Your code here\n    pass\n',
        testCode: `attempt = 0
@retry(times=3)
def flaky():
    global attempt
    attempt += 1
    if attempt < 3:
        raise ValueError("Not yet")
    return "success"
attempt = 0
result = flaky()
assert result == "success"
assert attempt == 3`
      },
      {
        id: 'dec-8', title: 'Class Decorator Simulation', difficulty: 'hard', xp: 70,
        languages: ['python'],
        desc: 'Implement a class-based decorator `Multiplier(factor)` that multiplies the result of the decorated function by `factor`. Use the `__call__` method.',
        hint: 'In Python, `__call__` makes an object behave like a function (callable). Wrap the logic inside.',
        initialCode: 'class Multiplier:\n    def __init__(self, factor):\n        self.factor = factor\n\n    def __call__(self, func):\n        # Your code here\n        pass\n',
        testCode: `@Multiplier(3)
def get_val(): return 5
assert get_val() == 15
@Multiplier(2)
def add(a, b): return a + b
assert add(10, 5) == 30`
      }
    ]
  },
  {
    id: 'gen', label: 'Generators', icon: 'zap',
    color: '#34d399',
    bg: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.05))',
    problems: [
      {
        id: 'gen-1', title: 'Infinite Fibonacci', difficulty: 'medium', xp: 60,
        languages: ['python', 'js'],
        desc: 'Create a generator `fib(n)` that yields the first `n` numbers in the Fibonacci sequence.',
        examples: [
          { input: 'n = 5', output: '[0, 1, 1, 2, 3]' }
        ],
        constraints: [
          'n >= 0',
          'Memory usage should be O(1) beyond the result storage.'
        ],
        initialCode: 'def fib(n):\n    # Your code here\n    pass\n',
        testCode: `assert list(fib(5)) == [0, 1, 1, 2, 3]
assert list(fib(1)) == [0]
assert list(fib(0)) == []`,
        initialCodeJs: 'function* fib(n) {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
const res = [...fib(5)];
assert(JSON.stringify(res) === '[0,1,1,2,3]', 'Test 1');
assert(JSON.stringify([...fib(1)]) === '[0]', 'Test 2');
assert(JSON.stringify([...fib(0)]) === '[]', 'Test 3');`
      },
      {
        id: 'gen-2', title: 'Safe Take', difficulty: 'medium', xp: 50,
        languages: ['python', 'js'],
        hint: 'Python: Use `itertools.islice` concept or a `for` loop with a counter. JS: Loop with `yield` and break when `n` is reached.',
        initialCode: 'def take(iterable, n):\n    # Your code here\n    pass\n',
        testCode: `assert list(take(range(100), 3)) == [0, 1, 2]\nassert list(take([1, 2], 10)) == [1, 2]`,
        initialCodeJs: 'function* take(iterable, n) {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };\nconst res = [...take([0,1,2,3,4], 3)];\nassert(JSON.stringify(res) === "[0,1,2]", "Test 1");\nassert(JSON.stringify([...take([1,2], 10)]) === "[1,2]", "Test 2");`
      },
      {
        id: 'gen-3', title: 'yield from', difficulty: 'medium', xp: 60,
        languages: ['python', 'js'],
        desc: 'Write a generator `flatten_gen(matrix)` using `yield from` (or JS `yield*`) to flatten a list/array of lists/arrays.',
        hint: 'Python: `yield from row`. JS: `yield* row` inside a loop.',
        initialCode: 'def flatten_gen(matrix):\n    # Your code here\n    pass\n',
        testCode: `assert list(flatten_gen([[1, 2], [3], [4, 5]])) == [1, 2, 3, 4, 5]
assert list(flatten_gen([[]])) == []
assert list(flatten_gen([])) == []`,
        initialCodeJs: 'function* flattenGen(matrix) {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
const res = [...flattenGen([[1,2],[3],[4,5]])];
assert(JSON.stringify(res) === '[1,2,3,4,5]', 'Test 1');
assert(JSON.stringify([...flattenGen([[]])]) === '[]', 'Test 2');`
      },
      {
        id: 'gen-4', title: 'Infinite Counter', difficulty: 'easy', xp: 40,
        languages: ['python', 'js'],
        desc: 'Write a generator `counter(start=0)` that yields integers indefinitely starting from `start`.',
        hint: 'Use `while True: yield start; start += 1`.',
        initialCode: 'def counter(start=0):\n    # Your code here\n    pass\n',
        testCode: `import itertools\ngen = counter(5)\nassert list(itertools.islice(gen, 4)) == [5, 6, 7, 8]\ngen2 = counter()\nassert list(itertools.islice(gen2, 3)) == [0, 1, 2]`,
        initialCodeJs: 'function* counter(start = 0) {\n  // your code\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };\nconst gen = counter(5);\nassert(gen.next().value === 5);\nassert(gen.next().value === 6);`
      },
      {
        id: 'gen-5', title: 'Running Average', difficulty: 'medium', xp: 70,
        languages: ['python', 'js'],
        desc: 'Write a generator `running_avg(iterable)` that yields the running (cumulative) average after each element.',
        hint: 'Keep a `total` and `count` variable. After each element: `count += 1; total += x; yield total / count`.',
        initialCode: 'def running_avg(iterable):\n    # Your code here\n    pass\n',
        testCode: `result = list(running_avg([10, 20, 30]))\nassert result[0] == 10.0\nassert result[1] == 15.0\nassert result[2] == 20.0`,
        initialCodeJs: 'function* runningAvg(iterable) {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };\nconst res = [...runningAvg([10, 20, 30])];\nassert(res[0] === 10);\nassert(res[1] === 15);\nassert(res[2] === 20);`
      },
      {
        id: 'gen-6', title: 'Generator Pipeline', difficulty: 'hard', xp: 80,
        languages: ['python', 'js'],
        desc: 'Build a pipeline: `source(n)` generates 0..n-1, `squares(gen)` takes a generator, `above(gen, threshold)` filters results. Chain them.',
        initialCode: 'def source(n):\n    pass\ndef squares(gen):\n    pass\ndef above(gen, threshold):\n    pass\n',
        testCode: `result = list(above(squares(source(6)), 10))\nassert result == [16, 25]`,
        initialCodeJs: 'function* source(n) {\n  for (let i = 0; i < n; i++) yield i;\n}\nfunction* squares(gen) {\n  for (const v of gen) yield v * v;\n}\nfunction* above(gen, thr) {\n  for (const v of gen) if (v > thr) yield v;\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };\nconst res = [...above(squares(source(6)), 10)];\nassert(JSON.stringify(res) === '[16,25]');`
      },
      {
        id: 'gen-7', title: 'Sliding Window', difficulty: 'hard', xp: 90,
        languages: ['python', 'js'],
        hint: 'Python: Use list slicing `lst[i:i+size]`. JS: Use `arr.slice(i, i + size)`.',
        initialCode: 'def sliding_window(lst, size):\n    pass\n',
        testCode: `assert list(sliding_window([1,2,3,4,5], 3)) == [(1,2,3),(2,3,4),(3,4,5)]`,
        initialCodeJs: 'function* slidingWindow(lst, size) {\n  for (let i = 0; i <= lst.length - size; i++) {\n    yield lst.slice(i, i + size);\n  }\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };\nconst res = [...slidingWindow([1,2,3,4,5], 3)];\nassert(res.length === 3 && res[0][2] === 3);`
      },
      {
        id: 'gen-8', title: 'send() Accumulator', difficulty: 'hard', xp: 100,
        languages: ['python', 'js'],
        desc: 'Write a generator `accumulator()` that starts at 0. Each call to `.send(value)` (JS: `.next(value)`) adds `value` to a running total and yields it.',
        hint: 'Python: `val = yield total`. JS: `let val = yield total`. First call primes it.',
        initialCode: 'def accumulator():\n    total = 0\n    # Your code here\n    pass\n',
        testCode: `gen = accumulator()\nnext(gen)   # prime\nassert gen.send(10) == 10\nassert gen.send(5) == 15\nassert gen.send(20) == 35`,
        initialCodeJs: 'function* accumulator() {\n  let total = 0;\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };\nconst gen = accumulator();\ngen.next(); // prime\nassert(gen.next(10).value === 10);\nassert(gen.next(5).value === 15);\nassert(gen.next(20).value === 35);`
      }
    ]
  },
  {
    id: 'async', label: 'Async/Await', icon: 'rocket',
    color: '#fb923c',
    bg: 'linear-gradient(135deg, rgba(251,146,60,0.2), rgba(251,146,60,0.05))',
    problems: [
      {
        id: 'async-1', title: 'Async Basics', difficulty: 'easy', xp: 30,
        languages: ['python', 'js'],
        desc: 'Write an async function `basic_async()` that returns the string `"Async works!"`. This introduces basic async syntax.',
        hint: 'Python: use `async def`. JS: use `async function`. No await is needed for a simple return.',
        initialCode: 'import asyncio\n\nasync def basic_async():\n    # Your code here\n    pass\n',
        testCode: `import asyncio\nassert asyncio.run(basic_async()) == "Async works!"`,
        initialCodeJs: 'async function basicAsync() {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };\nbasicAsync().then(r => assert(r === 'Async works!', 'Test 1'));`
      },
      {
        id: 'async-2', title: 'Gather Results', difficulty: 'medium', xp: 60,
        languages: ['python', 'js'],
        desc: 'Write `run_both(p1, p2)` that runs two concurrent tasks and returns their results.',
        hint: 'Python: `asyncio.gather`. JS: `Promise.all`.',
        initialCode: 'import asyncio\n\nasync def run_both(c1, c2):\n    # Your code here\n    pass\n',
        testCode: `import asyncio\nasync def a(): return 1\nasync def b(): return 2\nres = asyncio.run(run_both(a(), b()))\nassert list(res) == [1, 2]`,
        initialCodeJs: 'async function runBoth(p1, p2) {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };\nrunBoth(Promise.resolve(1), Promise.resolve(2)).then(res => {\n  assert(JSON.stringify(res) === "[1,2]", "Gather failed");\n});`
      },
      {
        id: 'async-3', title: 'Smart Timeout', difficulty: 'medium', xp: 70,
        languages: ['python', 'js'],
        desc: 'Write an async function `run_with_timeout(coro, limit)` that runs a task. If it takes > `limit` ms (JS: ms, Python: s), return `"Timeout"`. Otherwise return result.',
        constraints: [
          'Python: asyncio.wait_for. JS: Promise.race with a timeout promise.'
        ],
        initialCode: 'import asyncio\n\nasync def run_with_timeout(coro, limit):\n    # Your code here\n    pass\n',
        testCode: `import asyncio
async def fast(): return "Done"
async def slow(): 
    await asyncio.sleep(0.5)
    return "Late"
assert asyncio.run(run_with_timeout(fast(), 2)) == "Done"
assert asyncio.run(run_with_timeout(slow(), 0.1)) == "Timeout"`,
        initialCodeJs: 'async function runWithTimeout(task, ms) {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
const fast = async () => 'Done';
const slow = async () => { await new Promise(r => setTimeout(r, 100)); return 'Late'; };
Promise.race([
  runWithTimeout(fast(), 500).then(r => assert(r === 'Done', 'Fast failed')),
  runWithTimeout(slow(), 50).then(r => assert(r === 'Timeout', 'Slow failed'))
]);`
      },
      {
        id: 'async-4', title: 'Sleep and Compute', difficulty: 'easy', xp: 40,
        languages: ['python', 'js'],
        desc: 'Write an async function `sleep_and_add(x, delay)` that sleeps then returns `x + 10`.',
        hint: 'Python: `await asyncio.sleep(delay)`. JS: `await new Promise(r => setTimeout(r, delay*1000))`.',
        initialCode: 'import asyncio\n\nasync def sleep_and_add(x, delay):\n    # Your code here\n    pass\n',
        testCode: `import asyncio, time\nstart = time.time()\nres = asyncio.run(sleep_and_add(5, 0.1))\nassert res == 15\nassert time.time() - start >= 0.08`,
        initialCodeJs: 'async function sleepAndAdd(x, delayS) {\n  // your code\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };\nconst start = Date.now();\nsleepAndAdd(5, 0.1).then(res => {\n  assert(res === 15);\n  assert(Date.now() - start >= 80);\n});`
      },
      {
        id: 'async-5', title: 'Async Context Manager', difficulty: 'hard', xp: 90,
        languages: ['python'],
        desc: 'Implement an `AsyncDB` context manager. It should simulate connecting to a database. `__aenter__` (Python) should set `db.connected = True`.',
        hint: 'In Python, use `async def __aenter__(self):` and `async def __aexit__(self, exc_type, exc, tb):`.',
        initialCode: 'class AsyncDB:\n    def __init__(self):\n        self.connected = False\n\n    # Implement __aenter__ and __aexit__\n',
        testCode: `import asyncio

async def test():
    async with AsyncDB() as db:
        assert db.connected == True
    assert db.connected == False

asyncio.run(test())`
      },
      {
        id: 'async-6', title: 'Async Generator', difficulty: 'medium', xp: 70,
        languages: ['python', 'js'],
        desc: 'Write an async generator `async_count(n)` that yields integers from 0 to `n-1` with a tiny delay between each.',
        hint: '`async def` with `yield`. Consume with `async for`. In JS: `async function*`.',
        initialCode: 'import asyncio\n\nasync def async_count(n):\n    # Your code here\n    pass\n',
        testCode: `import asyncio
async def collect():
    return [x async for x in async_count(4)]
assert asyncio.run(collect()) == [0, 1, 2, 3]`,
        initialCodeJs: 'async function* asyncCount(n) {\n  // your code\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };\n(async () => {\n  const res = [];\n  for await (const x of asyncCount(3)) res.push(x);\n  assert(JSON.stringify(res) === '[0,1,2]');\n})();`
      },
      {
        id: 'async-7', title: 'Async Queue: Producer', difficulty: 'hard', xp: 100,
        languages: ['python'],
        desc: 'Coordinate a producer and consumer using an `asyncio.Queue`. The producer adds items, and the consumer waits for and retrieves them.',
        hint: 'Use `await queue.put(item)` and `await queue.get()`. Don\'t forget to signal task completion with `task_done()` if using join.',
        initialCode: 'import asyncio\n\nasync def producer(queue, items):\n    pass\n\nasync def consumer(queue, n):\n    pass\n',
        testCode: `import asyncio
async def test():
    q = asyncio.Queue()
    await producer(q, ["c", "a", "b"])
    result = await consumer(q, 3)
    assert result == ["a", "b", "c"], f"Got: {result}"
asyncio.run(test())`
      },
      {
        id: 'async-8', title: 'Semaphore Concurrency', difficulty: 'hard', xp: 100,
        languages: ['python'],
        desc: 'Limit the number of concurrent tasks using a `Semaphore`. This prevents overloading resources like APIs or databases.',
        hint: 'Context manager usage: `async with semaphore:`. Wrap each coroutine in a task that uses the semaphore.',
        initialCode: 'import asyncio\n\nasync def limited_run(coros, limit):\n    # Your code here\n    pass\n',
        testCode: `import asyncio
active = 0
max_active = 0

async def track():
    global active, max_active
    active += 1
    max_active = max(max_active, active)
    await asyncio.sleep(0.05)
    active -= 1
    return 1

active = 0; max_active = 0
results = asyncio.run(limited_run([track() for _ in range(6)], 2))
assert sum(results) == 6
assert max_active == 2, f"Expected exactly 2 concurrency, got {max_active}"`
      },
      {
        id: 'async-9', title: 'Run Blocking in Thread', difficulty: 'hard', xp: 90,
        languages: ['python'],
        desc: 'Write `run_blocking(fn, *args)` that runs a synchronous (blocking) function without blocking the event loop, using `asyncio.to_thread`.',
        hint: '`return await asyncio.to_thread(fn, *args)`',
        initialCode: 'import asyncio\n\nasync def run_blocking(fn, *args):\n    # Your code here\n    pass\n',
        testCode: `import asyncio, time
def slow_square(x):
    time.sleep(0.05)
    return x * x
result = asyncio.run(run_blocking(slow_square, 7))
assert result == 49, f"Got {result}"`
      },
      {
        id: 'async-10', title: 'Cancel and Cleanup', difficulty: 'hard', xp: 100,
        languages: ['python'],
        desc: 'Write an async function `cancellable_task()` that runs forever (`while True: await asyncio.sleep(0.05)`), but catches `asyncio.CancelledError` and returns `"cleaned up"`.',
        hint: 'Wrap the loop in `try/except asyncio.CancelledError: return "cleaned up"`.',
        initialCode: 'import asyncio\n\nasync def cancellable_task():\n    # Your code here — make it run, then handle cancellation\n    pass\n',
        testCode: `import asyncio
async def test():
    task = asyncio.create_task(cancellable_task())
    await asyncio.sleep(0.1)
    task.cancel()
    result = await task
    assert result == "cleaned up", f"Got {result}"
asyncio.run(test())`
      }
    ]
  },
  {
    id: 'js', label: 'JavaScript', icon: 'code-2', languages: ['js'],
    color: '#f7df1e',
    bg: 'linear-gradient(135deg, rgba(247,223,30,0.2), rgba(247,223,30,0.05))',
    problems: [
      {
        id: 'js-1', title: 'Even Filter', difficulty: 'easy', xp: 30,
        languages: ['js'],
        desc: 'Return a new array containing only even numbers from `arr`.',
        examples: [
          { input: '[1, 2, 3, 4]', output: '[2, 4]' }
        ],
        constraints: ['0 <= arr.length <= 1000'],
        initialCode: 'function filterEven(arr) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
assert(JSON.stringify(filterEven([1,2,3])) === '[2]', 'Error on odd filter');
assert(JSON.stringify(filterEven([2,4])) === '[2,4]', 'Error on even filter');
`
      },
      {
        id: 'js-2', title: 'Closure Counter', difficulty: 'easy', xp: 40,
        languages: ['js'],
        desc: 'Implement `makeCounter()` returning a function that increments and returns a count starting from 1.',
        examples: [
          { input: 'const c = makeCounter(); c(); c();', output: '2' }
        ],
        initialCode: 'function makeCounter() {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const c = makeCounter();
assert(c() === 1, '1');
assert(c() === 2, '2');
const c2 = makeCounter();
assert(c2() === 1, 'Indepedent check');
`
      },
      {
        id: 'js-6', title: 'Debounce (Native)', difficulty: 'hard', xp: 90,
        languages: ['js'],
        desc: 'Implement a `debounce` function that limits the rate at which a function can fire.',
        constraints: [
          'The return function should delay the execution of fn by `delay` ms.'
        ],
        initialCode: 'function debounce(fn, delay) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
let count = 0;
const inc = debounce(() => count++, 50);
inc(); inc(); inc();
await new Promise(r => setTimeout(r, 100));
assert(count === 1, 'Should fire once');
`
      },
      {
        id: 'js-10', title: 'Recursive Curry', difficulty: 'hard', xp: 100,
        languages: ['js'],
        desc: 'Write a `curry` function that converts a function of `n` arguments into a series of functions that each take a single argument.',
        hint: 'Use recursion: if the number of arguments provided so far equals `fn.length`, call `fn`. Otherwise, return a new function that waits for more.',
        initialCode: 'function curry(fn) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const add = (a, b, c) => a + b + c;
const curried = curry(add);
assert(curried(1)(2)(3) === 6, '1-2-3');
assert(curried(1, 2)(3) === 6, '1,2-3');
`
      },
    ]
  },
  {
    id: 'react', label: 'React Patterns', icon: 'atom', lang: 'js',
    color: '#61dafb',
    bg: 'linear-gradient(135deg, rgba(97,218,251,0.2), rgba(97,218,251,0.05))',
    problems: [
      {
        id: 'react-1', title: 'useReducer Pattern', difficulty: 'medium', xp: 60,
        desc: 'Implement a `counterReducer(state, action)` function. It should handle actions `{type:"increment"}`, `{type:"decrement"}`, and `{type:"reset"}`. State is `{count: 0}`.',
        hint: 'Use a switch on `action.type`. Return new state objects.',
        initialCode: 'function counterReducer(state, action) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const s0 = {count: 0};
assert(counterReducer(s0, {type:"increment"}).count === 1, 'increment failed');
assert(counterReducer({count: 5}, {type:"decrement"}).count === 4, 'decrement failed');
assert(counterReducer({count: 99}, {type:"reset"}).count === 0, 'reset failed');
`
      },
      {
        id: 'react-2', title: 'Custom Hook: useToggle', difficulty: 'easy', xp: 40,
        desc: 'Write a function `createToggle(initial)` that returns an object `{value, toggle, setTrue, setFalse}`. `toggle()` flips the value, `setTrue/setFalse` set it explicitly.',
        hint: 'Use closure to hold state. Return methods that modify it.',
        initialCode: 'function createToggle(initial = false) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const t = createToggle(false);
assert(t.value === false, 'initial should be false');
t.toggle(); assert(t.value === true, 'after toggle');
t.toggle(); assert(t.value === false, 'after 2nd toggle');
t.setTrue(); assert(t.value === true, 'setTrue');
t.setFalse(); assert(t.value === false, 'setFalse');
`
      },
      {
        id: 'react-3', title: 'Props Validation', difficulty: 'easy', xp: 30,
        desc: 'Write `validateProps(props, schema)` that checks if all required keys in schema exist in props. Schema is `{key: {required: bool, type: string}}`. Return `{valid: bool, errors: []}`.',
        hint: 'Loop through schema keys. Check existence and typeof.',
        initialCode: 'function validateProps(props, schema) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const schema = { name: {required:true, type:'string'}, age: {required:true, type:'number'} };
const r1 = validateProps({name:"A", age:25}, schema);
assert(r1.valid === true, 'valid props');
const r2 = validateProps({name:"A"}, schema);
assert(r2.valid === false, 'missing age');
assert(r2.errors.length > 0, 'should have errors');
`
      },
      {
        id: 'react-4', title: 'Event Emitter', difficulty: 'medium', xp: 70,
        desc: 'Build a simple EventEmitter class with `on(event, fn)`, `off(event, fn)`, and `emit(event, ...args)` methods.',
        hint: 'Store listeners in a Map of arrays. `emit` calls all listeners for that event.',
        initialCode: 'class EventEmitter {\n  constructor() {\n    this.listeners = {};\n  }\n  on(event, fn) { /* your code */ }\n  off(event, fn) { /* your code */ }\n  emit(event, ...args) { /* your code */ }\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const ee = new EventEmitter();
let val = 0;
const handler = (n) => val += n;
ee.on('add', handler);
ee.emit('add', 5); assert(val === 5, 'emit once');
ee.emit('add', 3); assert(val === 8, 'emit twice');
ee.off('add', handler);
ee.emit('add', 10); assert(val === 8, 'after off');
`
      },
      {
        id: 'react-5', title: 'Immutable State Update', difficulty: 'medium', xp: 60,
        desc: 'Write `updateNested(obj, path, value)` that returns a new object with the value at the given dot-separated path updated, without mutating the original.',
        hint: 'Split path by dot. Recursively spread and set.',
        initialCode: 'function updateNested(obj, path, value) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const state = { user: { name: "Alice", address: { city: "NYC" } } };
const next = updateNested(state, "user.address.city", "LA");
assert(next.user.address.city === "LA", 'updated value');
assert(state.user.address.city === "NYC", 'original unchanged');
assert(next !== state, 'different reference');
`
      },
      {
        id: 'react-6', title: 'Shallow Equal (memo)', difficulty: 'medium', xp: 60,
        languages: ['js'],
        desc: 'Implement `shallowEqual(objA, objB)`. It returns true if both objects are the same reference, or have the same keys/values (one level deep).',
        hint: 'First check if `a === b`. Then check keys length. Finally, loop through keys and check `a[key] === b[key]`.',
        examples: [
          { input: 'a = {x:1}, b = {x:1}', output: 'true' },
          { input: 'a = {x:1}, b = {x:1, y:2}', output: 'false' }
        ],
        constraints: [
          'Assume both inputs are objects (non-null).',
          'Only check top-level keys.'
        ],
        initialCode: 'function shallowEqual(a, b) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
assert(shallowEqual({a:1}, {a:1}) === true, 'Basic equal');
assert(shallowEqual({a:1}, {a:2}) === false, 'Different value');
assert(shallowEqual({a:1}, {b:1}) === false, 'Different key');
`
      },
      {
        id: 'react-7', title: 'Virtual DOM Diff', difficulty: 'hard', xp: 100,
        languages: ['js'],
        desc: 'Write `diff(oldTree, newTree)` that compares two simple vDOM trees and returns an array of patches like `{type: "REPLACE"|"PROPS"|"TEXT"}`.',
        hint: 'Comparison priority: 1. Different tags -> REPLACE. 2. Both text -> TEXT if content changed. 3. Same tag -> check PROPS.',
        examples: [
          { input: 'old = {tag:"div"}, new = {tag:"span"}', output: '[{type:"REPLACE"}]' }
        ],
        initialCode: 'function diff(oldNode, newNode) {\n  const patches = [];\n  // Your code here\n  return patches;\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const p1 = diff({tag:"div"}, {tag:"span"});
assert(p1.some(p => p.type === "REPLACE"), 'should detect tag change');
const p2 = diff({tag:"div", props:{id:"a"}}, {tag:"div", props:{id:"b"}});
assert(p2.some(p => p.type === "PROPS"), 'should detect prop change');
`
      },
      {
        id: 'react-8', title: 'Mini Redux Store', difficulty: 'hard', xp: 90,
        languages: ['js'],
        desc: 'Build a `createStore(reducer, initialState)` that returns `{getState, dispatch, subscribe}`. This is a core Redux pattern.',
        hint: 'Use a local `state` variable and an array of `listeners`. `dispatch` should update state and call all listeners.',
        initialCode: 'function createStore(reducer, initialState) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const reducer = (s, a) => a.type === "ADD" ? {c: s.c + 1} : s;
const store = createStore(reducer, {c: 0});
store.dispatch({type: "ADD"});
assert(store.getState().c === 1, 'dispatch update');
`
      },
      {
        id: 'react-9', title: 'useEffect Cleanup', difficulty: 'medium', xp: 70,
        languages: ['js'],
        desc: 'Simulate React\'s `useEffect` behavior including cleanup. The effect runs setup and returns a cleanup function.',
        hint: 'Hold the return value of `setupFn`. Call it before re-running setup or when destroying.',
        initialCode: 'function createEffect(setupFn) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
let log = [];
const eff = createEffect(() => { log.push("U"); return () => log.push("C"); });
eff.rerun();
assert(log.join("") === "U C U", 'rerun sequence');
`
      },
      {
        id: 'react-10', title: 'Route Matcher', difficulty: 'medium', xp: 70,
        languages: ['js'],
        desc: 'Write `matchRoute(pattern, path)` that matches URL patterns like `/users/:id` against paths like `/users/42`. Return an object with the parameter values.',
        hint: 'Convert the pattern into a regex (e.g. `:id` becomes `([^/]+)`). Use `match()` to extract parameter values.',
        initialCode: 'function matchRoute(pattern, path) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const r = matchRoute("/users/:id", "/users/42");
assert(r?.id === "42", 'param capture');
assert(matchRoute("/a", "/b") === null, 'mismatch');
`
      }
    ]
  },
  {
    id: 'rn', label: 'React Native', icon: 'smartphone', lang: 'js',
    color: '#06b6d4',
    bg: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.05))',
    problems: [
      {
        id: 'rn-1', title: 'Style Flattener', difficulty: 'easy', xp: 30,
        languages: ['js'],
        desc: 'Implement `flattenStyles(...styles)` which merges an array of style objects. Later styles in the array takes precedence.',
        hint: 'Use `Object.assign({}, ...styles)` or the spread operator `{...}` in a loop.',
        initialCode: 'function flattenStyles(...styles) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const s = flattenStyles({flex:1}, {color:"red"}, {flex:2});
assert(s.flex === 2, 'flex overridden');
`
      },
      {
        id: 'rn-2', title: 'Key Extractor', difficulty: 'easy', xp: 40,
        languages: ['js'],
        desc: 'Implement `createKeyExtractor(field)` that returns a function for FlatList keys. Fallback to `"item_" + index` if field is missing.',
        hint: 'Return a function `(item, index) => String(item[field] || "item_" + index)`.',
        initialCode: 'function createKeyExtractor(field) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const ke = createKeyExtractor("id");
assert(ke({id: 42}, 0) === "42", 'id');
assert(ke({x: 1}, 5) === "item_5", 'fallback');
`
      },
      {
        id: 'rn-3', title: 'Section List Mapper', difficulty: 'medium', xp: 60,
        desc: 'Write `toSections(items, key)` that groups items by a key into `[{title, data}]` format.',
        initialCode: 'function toSections(items, key) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const items = [{v:1,cat:"A"}, {v:2,cat:"B"}, {v:3,cat:"A"}];
const res = toSections(items, "cat");
assert(res.length === 2, '2 sections');
`
      },
      {
        id: 'rn-4', title: 'Layout Scaler', difficulty: 'medium', xp: 60,
        desc: 'Write a utility that scales UI dimensions based on a base screen width of 375. Return a `scale(size)` function.',
        initialCode: 'const SCREEN_WIDTH = 375;\nfunction createScaler(baseWidth) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const scaler = createScaler(750); // half scale for 375
assert(scaler.scale(100) === 50, 'scale test');
`
      },
      {
        id: 'rn-5', title: 'Navigation Stack', difficulty: 'hard', xp: 80,
        desc: 'Create a `NavStack` class with `push`, `pop`, and `currentParams` methods.',
        initialCode: 'class NavStack {\n  constructor(initial) {\n    this.stack = [initial];\n  }\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const n = new NavStack({s:"H", p:{}});
n.push("D", {id:5});
assert(n.current() === "D", 'push');
assert(n.params().id === 5, 'params');
`
      },
      {
        id: 'rn-6', title: 'Storage Mock (Async)', difficulty: 'medium', xp: 70,
        desc: 'Build an `AsyncStore` mock with `getItem`, `setItem` (async).',
        initialCode: 'class AsyncStore {\n  constructor() { this.data = {}; }\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const s = new AsyncStore();
await s.setItem("k", "v");
assert(await s.getItem("k") === "v", 'async store');
`
      },
      {
        id: 'rn-7', title: 'Range Interpolator', difficulty: 'hard', xp: 80,
        languages: ['js'],
        desc: 'Implement `interpolate(value, config)` mapping input range to output range linearly. e.g. [0, 10] -> [0, 100].',
        hint: 'Formula: `outputMin + (value - inputMin) * (outputMax - outputMin) / (inputMax - inputMin)`.',
        initialCode: 'function interpolate(value, config) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const res = interpolate(5, {inputRange: [0, 10], outputRange: [0, 100]});
assert(res === 50, 'map');
`
      },
      {
        id: 'rn-8', title: 'Deep Link Parser', difficulty: 'hard', xp: 90,
        languages: ['js'],
        desc: 'Implement `parseLink(url, scheme)` that extracts query parameters from a deep link into a dictionary.',
        hint: 'Use `new URL(url)` or split the string by `?` then `&`.',
        initialCode: 'function parseLink(url, scheme) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const p = parseLink("myapp://search?q=foo&id=1", "myapp");
assert(p.q === "foo", 'param q');
assert(p.id === "1", 'param id');
`
      }
    ]
  },
  {
    id: 'drf', label: 'Django & DRF', icon: 'sparkles',
    color: '#092e20',
    bg: 'linear-gradient(135deg, rgba(9,46,32,0.3), rgba(9,46,32,0.05))',
    problems: [
      {
        id: 'drf-1', title: 'Field Validator', difficulty: 'easy', xp: 30,
        desc: 'Write `validate_email(value)` that returns `True` if the string contains exactly one `@` with text on both sides, else raises `ValueError("Invalid email")`.',
        hint: 'Split by `@`. Check you get exactly 2 parts, each non-empty.',
        initialCode: 'def validate_email(value):\n    # Your code here\n    pass\n',
        testCode: `assert validate_email("a@b.com") == True
try:
    validate_email("invalid")
    assert False, "Should raise"
except ValueError:
    pass
try:
    validate_email("@b.com")
    assert False
except ValueError:
    pass`
      },
      {
        id: 'drf-2', title: 'Serializer Validation', difficulty: 'medium', xp: 60,
        desc: 'Implement a `Serializer` class that validates an input dictionary against a list of required fields. Non-empty values are required.',
        hint: 'In `is_valid`, loop through `self.fields`. If a field is missing from `self.data` or is empty/None, add it to `self.errors`.',
        examples: [
          { input: 'Serializer({"name": "A"}, ["name", "email"])', output: 'isValid: False, errors: {"email": "required"}' }
        ],
        initialCode: 'class Serializer:\n    def __init__(self, data, fields):\n        self.data = data\n        self.fields = fields\n\n    def is_valid(self):\n        pass\n',
        testCode: `s = Serializer({"name": "Alice"}, ["name", "email"])
assert s.is_valid() == False
assert s.errors["email"] == "required"
s2 = Serializer({"name": "Bob", "email": "b@b.com"}, ["name", "email"])
assert s2.is_valid() == True`
      },
      {
        id: 'drf-3', title: 'Pagination Logic', difficulty: 'medium', xp: 50,
        desc: 'Write `paginate(items, page, size)` that returns a slice of items. `page` is 1-indexed.',
        hint: 'Calculate start: `(page - 1) * size`. Calculate end: `start + size`. Return `items[start:end]`.',
        initialCode: 'def paginate(items, page, size):\n    # Your code here\n    pass\n',
        testCode: `assert paginate(list(range(20)), 1, 5) == [0,1,2,3,4]
assert paginate(list(range(20)), 2, 5) == [5,6,7,8,9]`
      },
      {
        id: 'drf-4', title: 'Perm Check', difficulty: 'easy', xp: 40,
        desc: 'Write `has_perm(user, required)` that checks if user has all required permissions in their `perms` list.',
        hint: 'Use `all(p in user["perms"] for p in required)`.',
        initialCode: 'def has_perm(user, required):\n    # Your code here\n    pass\n',
        testCode: `u = {"perms": ["read", "write"]}
assert has_perm(u, ["read"]) == True
assert has_perm(u, ["admin"]) == False`
      },
      {
        id: 'drf-5', title: 'QuerySet Filter Chain', difficulty: 'hard', xp: 100,
        desc: 'Build a `QuerySet` class that allows chaining `.filter()` and `.values()` calls. This mimics the Django ORM.',
        hint: '`filter` should return a *new* `QuerySet` with filtered data. `values` should return a list of specific field values.',
        examples: [
          { input: 'qs.filter(age=30).values("name")', output: '["Alice", "Carol"]' }
        ],
        initialCode: 'class QuerySet:\n    def __init__(self, data):\n        self.data = data\n\n    def filter(self, **kwargs):\n        pass\n\n    def values(self, field):\n        pass\n',
        testCode: `data = [{"name":"Alice","age":30},{"name":"Bob","age":25},{"name":"Carol","age":30}]
qs = QuerySet(data)
assert qs.filter(age=30).values("name") == ["Alice", "Carol"]`
      },
      {
        id: 'drf-10', title: 'Token Encoder', difficulty: 'hard', xp: 100,
        desc: 'Implement a simple JWT-like encoder `encode(payload, secret)`.',
        initialCode: 'import json, base64, hashlib\ndef encode(payload, secret):\n    pass\n',
        testCode: `t = encode({"user":1}, "key")
assert "." in t`
      }
    ]
  },
  {
    id: 'sql', label: 'SQL Mastery', icon: 'database',
    color: '#336791',
    bg: 'linear-gradient(135deg, rgba(51,103,145,0.2), rgba(51,103,145,0.05))',
    problems: [
      {
        id: 'sql-1', title: 'Schema Designer', difficulty: 'easy', xp: 30,
        languages: ['sql'],
        desc: 'Create a table named `users` with three columns: `id` (Primary Key), `name` (Text), and `age` (Integer). Then insert at least three records into it.',
        constraints: ['id must be PRIMARY KEY', 'age must be INTEGER'],
        initialCode: '-- Write your SQL here\nCREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  -- ...\n);\n\nINSERT INTO users ...',
        setupSql: '',
        validationPy: `
rows = cursor.execute("SELECT * FROM users").fetchall()
assert len(rows) >= 3, f"Expected at least 3 rows, got {len(rows)}"
cols = [description[0] for description in cursor.description]
assert 'id' in cols and 'name' in cols and 'age' in cols, "Missing required columns"
`,
      },
      {
        id: 'sql-2', title: 'Aggregate Stats', difficulty: 'easy', xp: 40,
        languages: ['sql'],
        desc: 'Calculate the total count of users and their average age from the `users` table. Label the columns as `total_count` and `average_age`.',
        initialCode: '-- Write a SELECT query to get count and average age\nSELECT ...',
        setupSql: 'CREATE TABLE users (id INT, name TEXT, age INT); INSERT INTO users VALUES (1,"A",20), (2,"B",30), (3,"C",40);',
        validationPy: `
res = cursor.execute(user_sql).fetchone()
assert res is not None, "Query returned no results"
assert abs(float(res[1]) - 30.0) < 0.01, f"Expected average 30.0, got {res[1]}"
assert int(res[0]) == 3, f"Expected count 3, got {res[0]}"
`,
      },
      {
        id: 'sql-4', title: 'Relationship Join', difficulty: 'medium', xp: 70,
        languages: ['sql'],
        desc: 'JOIN the `orders` table with the `users` table. Retrieve a list of user names and the products they ordered.',
        hint: 'Use `JOIN users ON orders.user_id = users.id`. Select the name and product columns.',
        initialCode: '-- Write your JOIN query here\nSELECT ...',
        setupSql: 'CREATE TABLE users (id INT, name TEXT); CREATE TABLE orders (id INT, user_id INT, product TEXT); INSERT INTO users VALUES (1,"Alice"), (2,"Bob"); INSERT INTO orders VALUES (101,1,"Laptop"), (102,2,"Phone");',
        validationPy: `
res = cursor.execute(user_sql).fetchall()
assert len(res) == 2, "Expected 2 rows"
names = [r[0] for r in res]
assert "Alice" in names and "Bob" in names, "Missing names in join result"
`,
      },
      {
        id: 'sql-8', title: 'ACID Transaction', difficulty: 'hard', xp: 100,
        languages: ['sql'],
        desc: 'Decrease the balance of account 1 by 50 and increase account 2 by 50. In SQLite, you can run multiple UPDATE statements.',
        hint: 'Use two UPDATE statements. SQLite in memory executes them sequentially.',
        initialCode: '-- Update both accounts\nUPDATE accounts SET ...',
        setupSql: 'CREATE TABLE accounts (id INT, balance INT); INSERT INTO accounts VALUES (1, 100), (2, 100);',
        validationPy: `
b1 = cursor.execute("SELECT balance FROM accounts WHERE id=1").fetchone()[0]
b2 = cursor.execute("SELECT balance FROM accounts WHERE id=2").fetchone()[0]
assert b1 == 50, f"Account 1 should be 50, got {b1}"
assert b2 == 150, f"Account 2 should be 150, got {b2}"
`,
      },
      {
        id: 'sql-10', title: 'Subquery Master', difficulty: 'hard', xp: 120,
        languages: ['sql'],
        desc: 'Find all users who have an age greater than the average age. Return their names and ages.',
        hint: 'Use a subquery in the WHERE clause: `WHERE age > (SELECT AVG(age) FROM users)`.',
        initialCode: '-- Use a subquery to find users older than average\nSELECT ...',
        setupSql: 'CREATE TABLE users (id INT, name TEXT, age INT); INSERT INTO users VALUES (1,"Young",20), (2,"Average",30), (3,"Old",70);',
        validationPy: `
res = cursor.execute(user_sql).fetchall()
assert len(res) == 1, f"Expected 1 user (Old), got {len(res)}"
assert res[0][0] == "Old", "Expected user 'Old'"
`,
      }
    ]
  },
  {
    id: 'perf', label: 'Performance', icon: 'zap', lang: 'js',
    color: '#ff9e64',
    bg: 'linear-gradient(135deg, rgba(255,158,100,0.2), rgba(255,158,100,0.05))',
    problems: [
      {
        id: 'perf-1', title: 'Throttling', difficulty: 'medium', xp: 70,
        desc: 'Implement a `throttle(fn, limit)` function that ensures `fn` is called at most once every `limit` milliseconds.',
        examples: [
          { input: 'const t = throttle(log, 100); t(); t();', output: 'log called once', explanation: 'Second call ignored because it was within 100ms.' }
        ],
        constraints: [
          'The first call should execute immediately.'
        ],
        initialCode: 'function throttle(fn, limit) {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
let count = 0;
const t = throttle(() => count++, 50);
t(); t(); t();
assert(count === 1, 'Throttled calls ignored');
`
      },
    ]
  },
  {
    id: 'sec', label: 'Security', icon: 'shield-check',
    color: '#f7768e',
    bg: 'linear-gradient(135deg, rgba(247,118,142,0.2), rgba(247,118,142,0.05))',
    problems: [
      {
        id: 'sec-1', title: 'Identifier Guard', difficulty: 'easy', xp: 40,
        desc: 'Write `is_safe_identifier(name)` that returns `True` if it contains only alphanumeric chars and underscores, and doesn\'t start with a digit.',
        examples: [
          { input: '"user_1"', output: 'True' },
          { input: '"1_user"', output: 'False' }
        ],
        initialCode: 'import re\n\ndef is_safe_identifier(name):\n    # Your code here\n    pass\n',
        testCode: `assert is_safe_identifier("valid_id") == True
assert is_safe_identifier("1_not_valid") == False
assert is_safe_identifier("no; drops") == False`
      },
      {
        id: 'sec-2', title: 'Password Mask', difficulty: 'easy', xp: 30,
        desc: 'Write `mask_password(data, key)` that replaces the value of a key in a dict with "****".',
        initialCode: 'def mask_password(data, key):\n    # Your code here\n    pass\n',
        testCode: `d = {"p": "123", "u": "a"}
mask_password(d, "p")
assert d["p"] == "****"`
      }
    ]
  },
  {
    id: 'cross', label: 'Cross‑Language', icon: 'dna',
    color: '#22c55e',
    bg: 'linear-gradient(135deg, rgba(34,197,94,0.18), rgba(34,197,94,0.05))',
    problems: [
      {
        id: 'cross-1',
        title: 'FizzBuzz Dual',
        difficulty: 'easy',
        xp: 40,
        languages: ['python', 'js'],
        desc: 'Implement `fizzbuzz(n)` that returns a list/array of length `n`, where each element is:\n- \"Fizz\" if the number is divisible by 3\n- \"Buzz\" if divisible by 5\n- \"FizzBuzz\" if divisible by both 3 and 5\n- otherwise the number itself.',
        examples: [
          { input: 'n = 5', output: '[1, 2, "Fizz", 4, "Buzz"]' },
          { input: 'n = 1', output: '[1]' }
        ],
        constraints: [
          '1 <= n <= 10^4'
        ],
        hint: 'Use modulo: `i % 3 == 0` and `i % 5 == 0`. Build the result in a list/array.',
        initialCodePy: 'def fizzbuzz(n):\n    # Your code here\n    pass\n',
        testCodePy: `assert fizzbuzz(1) == [1]
assert fizzbuzz(3) == [1, 2, "Fizz"]
assert fizzbuzz(5) == [1, 2, "Fizz", 4, "Buzz"]
assert fizzbuzz(15)[-1] == "FizzBuzz"
assert len(fizzbuzz(15)) == 15`,
        initialCodeJs: 'function fizzbuzz(n) {\n  // Your code here\n}\n',
        testCodeJs: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const out1 = fizzbuzz(1);
assert(Array.isArray(out1) && out1.length === 1 && out1[0] === 1, 'n=1');
const out2 = fizzbuzz(5);
assert(JSON.stringify(out2) === JSON.stringify([1,2,"Fizz",4,"Buzz"]), 'n=5');
const out3 = fizzbuzz(15);
assert(out3.length === 15 && out3[14] === "FizzBuzz", 'n=15');
`
      },
      {
        id: 'cross-2',
        title: 'Palindrome Check Dual',
        difficulty: 'easy',
        xp: 35,
        languages: ['python', 'js'],
        desc: 'Write `is_palindrome(s)` that returns `True`/`true` if `s` reads the same forwards and backwards, ignoring case and non-alphanumeric characters.',
        examples: [
          { input: '"A man, a plan, a canal: Panama"', output: 'True' },
          { input: '"race a car"', output: 'False' }
        ],
        constraints: [
          '0 <= len(s) <= 10^5'
        ],
        hint: 'Normalize with lowercase and filter to alphanumeric characters only, then compare to its reverse.',
        initialCodePy: 'def is_palindrome(s: str) -> bool:\n    # Your code here\n    pass\n',
        testCodePy: `assert is_palindrome("A man, a plan, a canal: Panama") is True
assert is_palindrome("race a car") is False
assert is_palindrome("") is True
assert is_palindrome("a") is True`,
        initialCodeJs: 'function is_palindrome(s) {\n  // Your code here\n}\n',
        testCodeJs: `
const assert = (c, m) => { if (!c) throw new Error(m); };
assert(is_palindrome("A man, a plan, a canal: Panama") === true, 'Panama');
assert(is_palindrome("race a car") === false, 'race a car');
assert(is_palindrome("") === true, 'empty');
assert(is_palindrome("a") === true, 'single');`
      },
      {
        id: 'cross-3',
        title: 'Two Sum Dual',
        difficulty: 'medium',
        xp: 70,
        languages: ['python', 'js'],
        desc: 'Given an array/list of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume exactly one solution exists.',
        examples: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }
        ],
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9'
        ],
        hint: 'Use a hash map / dict to remember previously seen values and their indices.',
        initialCodePy: 'def two_sum(nums, target):\n    # Your code here\n    pass\n',
        testCodePy: `out = two_sum([2,7,11,15], 9)
assert sorted(out) == [0,1]
out2 = two_sum([3,2,4], 6)
assert sorted(out2) == [1,2]
out3 = two_sum([3,3], 6)
assert sorted(out3) == [0,1]`,
        initialCodeJs: 'function two_sum(nums, target) {\n  // Your code here\n}\n',
        testCodeJs: `
const assert = (c, m) => { if (!c) throw new Error(m); };
let out = two_sum([2,7,11,15], 9);
out = out.sort();
assert(JSON.stringify(out) === JSON.stringify([0,1]), 'case1');
let out2 = two_sum([3,2,4], 6).sort();
assert(JSON.stringify(out2) === JSON.stringify([1,2]), 'case2');
let out3 = two_sum([3,3], 6).sort();
assert(JSON.stringify(out3) === JSON.stringify([0,1]), 'case3');`
      }
    ]
  },
  {
    id: 'boss', label: 'Boss Battles', icon: 'swords',
    color: '#eb6f92',
    bg: 'linear-gradient(135deg, rgba(235,111,146,0.2), rgba(235,111,146,0.05))',
    problems: [
      {
        id: 'boss-1', title: 'The Event Loop Overlord', difficulty: 'hard', xp: 500,
        languages: ['python', 'js'],
        desc: 'Build an async Pipeline: Write `fetch_user(id)` returning `{id, name, status: "active"}` after a delay. `process_users(ids)` fetches all concurrently.',
        hint: 'Python: use `asyncio.gather(*tasks)`. JS: use `Promise.all(tasks)`. Both should result in concurrent execution.',
        initialCode: 'import asyncio\n\nasync def fetch_user(uid):\n    pass\n\nasync def process_users(ids):\n    pass\n',
        testCode: `import asyncio
import time
async def test_overlord():
    start = time.time()
    res = await process_users([1, 2, 3])
    assert "User1" in res and "User2" in res and "User3" in res, f"Got {res}"
    assert time.time() - start < 0.1, "Took too long, not concurrent"
asyncio.run(test_overlord())`,
        initialCodeJs: 'async function fetchUser(uid) {\n  // your code\n}\nasync function processUsers(uids) {\n  // your code\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };
const start = Date.now();
processUsers([1,2,3]).then(res => {
  assert(res.length === 3, 'Length mismatch');
  assert(Date.now() - start < 200, 'Not concurrent');
});`
      },
      {
        id: 'boss-2', title: 'Caching Dragon', difficulty: 'hard', xp: 500,
        languages: ['python', 'js'],
        desc: 'Write `@lru_cache_custom(maxsize=3)` (Python) or a wrapper (JS) that evicts the least recently used item if cache exceeds maxsize.',
        hint: 'Python: use an `OrderedDict` to track access order. JS: use a `Map` which preserves insertion order.',
        initialCode: 'def lru_cache_custom(maxsize=3):\n    def decorator(func):\n        def wrapper(*args):\n            pass\n        return wrapper\n    return decorator\n',
        testCode: `calls = 0\n@lru_cache_custom(maxsize=2)\ndef compute(x):\n    global calls\n    calls += 1\n    return x * x\nassert compute(1) == 1\nassert compute(2) == 4\nassert compute(1) == 1\nassert calls == 2`,
        initialCodeJs: 'function lruCacheCustom(maxsize = 3) {\n  return function(func) {\n    // return a wrapped function\n  };\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };\nlet calls = 0;\nconst compute = x => { calls++; return x*x; };\nconst cached = lruCacheCustom(2)(compute);\nassert(cached(1) === 1);\nassert(cached(2) === 4);\nassert(cached(1) === 1);\nassert(calls === 2);`
      },
      {
        id: 'boss-3', title: 'The Matrix Rotator', difficulty: 'hard', xp: 200,
        languages: ['python', 'js'],
        desc: 'Rotate an N x N matrix 90 degrees clockwise in-place. This is a classic coding interview problem.',
        hint: 'First transpose the matrix (swap `matrix[i][j]` with `matrix[j][i]`), then reverse each row.',
        initialCode: 'def rotate_matrix(matrix):\n    # Your code here\n    pass\n',
        testCode: `m = [[1,2],[3,4]]\nrotate_matrix(m)\nassert m == [[3,1],[4,2]]`,
        initialCodeJs: 'function rotateMatrix(matrix) {\n  // Your code here\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };\nlet m = [[1,2],[3,4]];\nrotateMatrix(m);\nassert(JSON.stringify(m) === '[[3,1],[4,2]]');`
      },
      {
        id: 'boss-4', title: 'The Event Emitter', difficulty: 'hard', xp: 250, languages: ['js'],
        desc: 'Implement a full `EventEmitter` class with `on`, `off`, `once`, and `emit` methods.',
        examples: [
          { input: 'ee.once("hi", f); ee.emit("hi"); ee.emit("hi");', output: 'f called once' }
        ],
        initialCode: 'class EventEmitter {\n  // Your code here\n}\n',
        testCode: `
const assert = (c, m) => { if (!c) throw new Error(m); };
const e = new EventEmitter();
let v = 0;
const f = () => v++;
e.on('x', f); e.emit('x');
assert(v === 1, 'on failed');
`
      },
      {
        id: 'boss-5', title: 'Min Stack', difficulty: 'hard', xp: 300,
        languages: ['python', 'js'],
        desc: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time (O(1)).',
        hint: 'Use a secondary stack to keep track of the minimum value at each point in the main stack.',
        initialCode: 'class MinStack:\n    def __init__(self):\n        pass\n',
        testCode: `m = MinStack()\nm.push(-2); m.push(0); m.push(-3)\nassert m.get_min() == -3`,
        initialCodeJs: 'class MinStack {\n  constructor() {\n    // your code\n  }\n  push(val) {}\n  pop() {}\n  top() {}\n  getMin() {}\n}\n',
        testCodeJs: `const assert = (c, m) => { if (!c) throw new Error(m || 'Assertion failed'); };\nconst m = new MinStack();\nm.push(-2); m.push(0); m.push(-3);\nassert(m.getMin() === -3, 'Min should be -3');`
      }
    ]
  }
];
