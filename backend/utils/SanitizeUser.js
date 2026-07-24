exports.sanitizeUser = (user) => {
    return {
        _id: user._id,
        email: user.email || null,
        mobile: user.mobile || null, 
        isVerified: user.isVerified,
        isAdmin: user.isAdmin
    }
}