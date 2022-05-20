const { User, Thoughts } = require('../models');

const userCount = async () =>
  User.aggregate()
    .count('userCount')
    .then((numberOfUsers) => numberOfUsers);

const userController = {
    //CRUD COMMANDS

    // Get all users
    getUsers(req, res) {
        User.find()
        .then(async (users) => {
            const userObj = {
            users,
            userCount: await userCount(),
            };
            return res.json(userObj);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    // get a user by id
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .select('-__v')
        .lean()
        .then(async (user) =>
            !user
            ? res.status(404).json({ message: 'No user with that ID' })
            : res.json({
                user,
                friends: await friends(req.params.userId),
                })
        )
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },
    // create a new user
    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    // Delete a user
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
        .then((user) =>
            !user
            ? res.status(404).json({ message: 'No such student exists' })
            : Course.findOneAndUpdate(
                { students: req.params.studentId },
                { $pull: { students: req.params.studentId } },
                { new: true }
                )
        )
        .then((course) =>
            !course
            ? res.status(404).json({
                message: 'Student deleted, but no courses found',
                })
            : res.json({ message: 'Student successfully deleted' })
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // Add a friend
    addAssignment(req, res) {
        console.log('You are adding an assignment');
        console.log(req.body);
        Student.findOneAndUpdate(
        { _id: req.params.studentId },
        { $addToSet: { assignments: req.body } },
        { runValidators: true, new: true }
        )
        .then((student) =>
            !student
            ? res
                .status(404)
                .json({ message: 'No student found with that ID :(' })
            : res.json(student)
        )
        .catch((err) => res.status(500).json(err));
    },

    // Delete a friend
    removeAssignment(req, res) {
        Student.findOneAndUpdate(
        { _id: req.params.studentId },
        { $pull: { assignment: { assignmentId: req.params.assignmentId } } },
        { runValidators: true, new: true }
        )
        .then((student) =>
            !student
            ? res
                .status(404)
                .json({ message: 'No student found with that ID :(' })
            : res.json(student)
        )
        .catch((err) => res.status(500).json(err));
    },
}

module.exports = userController;