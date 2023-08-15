module.exports = {
  userTypes: {
    admin: {
      name: 'Admin',
      type_id: 1,
      isActive: true,
    },
    user: {
      student: {
        name: 'Student',
        type_id: 2,
        isActive: true,
      },
      instructor: {
        name: 'Instructor/Teacher',
        type_id: 3,
        isActive: true,
      },
      professional: {
        name: 'Working Professional',
        type_id: 4,
        isActive: true,
      },
    },
  },
};
