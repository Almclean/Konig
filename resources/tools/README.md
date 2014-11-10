Bin
=============
Useful scripts and tools

GenerateData.py
-------------
This is a very basic script to generate a set of random data (Parties, Locations, Ratings and Accounts) in the cql format for testing.

This takes two parameters:
   * The number of accounts to create (-n)
      * This will default to 100 if not supplied
   * The location of the data file with init data (should be under resources/sampleData) (-f)
      * This will cause the script to fail if not supplied

This use Python 3.4. The assumption here is the .py gives you a hint as to how to run this.

An example would be:
```
python GenerateData.py -n 120 -f "C:/development/SourceControl/Konig/resources/sampleData/initData.json"
```

bcryptUtil.js
-------------
A simple script to create a hashed value of the string based on a salt of 10

This takes one parameter:
   *  hash=Password

Where *Password* is the string you want to hash

To run this ensure you have run npm install on the project then run
```
node .\bcryptUtil.js hash=Password
```