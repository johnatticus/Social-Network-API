const router = require('express').Router();

const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend,
} = require('../../controllers/userController');

// api/users route
router.route('/').get(getUsers).post(createUser);
// api/users/:userId route
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);
// api/users/:userId/friends/:friendId route
router.route('/:userId/friends').post(addFriend);

router.route('/:userId/friends/:friendId').delete(removeFriend);
// export the route
module.exports = router;