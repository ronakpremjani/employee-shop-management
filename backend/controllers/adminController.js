const User = require('../models/User');
const bcrypt = require('bcrypt');

//          |----------------------------------|
//          |     create a new staff member    |
//          |----------------------------------|
const createStaff = async (req, res) => {
   try{
    const{
        name,
        email,
        phone,
        salary,
        password
    } = req.body;

    if (!name || !email || !phone || !salary || !password) {
        return res.status(400).json({
        success: false,
        message: 'All fields are required'
    });
}

    const existingUser = await User.findOne({ email });

    if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Email already exists'
    });
}

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingPhone = await User.findOne({ phone });
    
const user = new User({
    name,
    email,
    phone,
    salary,
    password: hashedPassword,
    role: 'staff'
});

await user.save();

return res.status(201).json({
    success: true,
    message: 'staff created successfully',
    data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
});

}catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,            
        });
    }
};

//          |----------------------------------|
//          |     get all staff members        |
//          |----------------------------------|

const getAllStaff = async (req, res) => {
    try {
        const staff = await User.find({ role: 'staff' }).select('-password');
        return res.status(200).json({
            success: true,
            message: 'Staff members retrieved successfully',
            count: staff.length,
            data: staff
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//          |----------------------------------|
//          |     update a staff member        |
//          |----------------------------------|

const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, salary, password } = req.body;

        // Find the staff member
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }

        // Prevent updating an admin
        if (user.role !== 'staff') {
            return res.status(403).json({
                success: false,
                message: 'You can only update staff members'
            });
        }

        // Check email uniqueness (only if email is changing)
        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });

            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already exists'
                });
            }

            user.email = email;
        }

        // Check phone uniqueness (only if phone is changing)
        if (phone && phone !== user.phone) {
            const existingPhone = await User.findOne({ phone });

            if (existingPhone) {
                return res.status(409).json({
                    success: false,
                    message: 'Phone number already exists'
                });
            }

            user.phone = phone;
        }

        // Update other fields
        if (name) user.name = name;
        if (salary) user.salary = salary;

        // Update password if provided
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Staff member updated successfully',
            data: user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//          |----------------------------------|
//          |     deactivate a staff member    |
//          |----------------------------------|

const deactivateStaff = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the staff member
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }

        // Prevent deactivating an admin
        if (user.role !== 'staff') {
            return res.status(403).json({
                success: false,
                message: 'Only staff members can be deactivated'
            });
        }

        // Already inactive?
        if (user.status === 'Inactive') {
            return res.status(200).json({
                success: true,
                message: 'Staff is already inactive'
            });
        }

        // Deactivate staff
        user.status = 'Inactive';

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Staff member has been deactivated successfully',
            data: user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createStaff,
    getAllStaff,
    updateStaff,
    deactivateStaff
};