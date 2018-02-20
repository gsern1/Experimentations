const chai = require('chai');
const students = require('../src/students.js');

const { Student } = students;

chai.should();

describe('students', () => {
  describe('Student', () => {
    it('should allow me to create a student', () => {
      const student = new Student('guillaume', 'serneels');
      student.should.not.equal(undefined);
      const greeting = student.greet();
      greeting.should.equal('hello guillaume');
    });
  });
});
