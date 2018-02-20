function Student(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

Student.prototype.greet = function greet() {
  return 'hello ' + this.firstName;
};

exports.Student = Student;

