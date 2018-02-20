require('./chai-config');
const students = require('../src/students.js');

const { Student } = students;

describe('students', () => {
  describe('Student', () => {
    it('should allow me to create a student', () => {
      const student = new Student('guillaume', 'serneels');
      student.should.not.be.undefined();
    });
  });
  describe('greet', () => {
    it('should return the correct greetings', () => {
      const student = new Student('guillaume', 'serneels');
      const greeting = student.greet();
      greeting.should.equal('hello guillaume');
    });
  });
});
