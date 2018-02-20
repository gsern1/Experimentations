class Student {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  greet() {
    return `hello ${this.firstName}`;
  }
}

exports.Student = Student;

