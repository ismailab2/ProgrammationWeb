
import Contact from '../models/contactModel.js';
import { ObjectId } from 'mongodb';

// Get all contacts
export async function getAllContacts() {
    try {
        const total = await Contact.countDocuments({});
        const contacts = await Contact.find({});

        return {
            success: true,
            data: contacts,
            total: total.toString()
        };
    } catch (err) {
        return {
            success: false,
            message: 'Contacts not found: ' + err.message
        };
    }
}

// Get contact by Id
export async function getContactById(id) {
    try {
        if (!ObjectId.isValid(id)) {
            return {
                success: false,
                message: 'Invalid contact ID'
            };
        }

        const contact = await Contact.findById(new ObjectId(id));

        if (!contact) {
            return {
                success: false,
                message: 'Contact not found'
            };
        }

        return {
            success: true,
            data: contact
        };
    } catch (err) {
        return {
            success: false,
            message: 'Error finding contact: ' + err.message
        };
    }
}

// Add a new contact
export async function addContact(body) {
    try {
        const contact = await Contact.create(body);

        return {
            success: true,
            data: contact
        };
    } catch (err) {
        return {
            success: false,
            message: 'Error adding contact: ' + err.message
        };
    }
}

// Update an existing contact
export async function updateContact(id, name = null, age = null) {
    try {
        if (!ObjectId.isValid(id)) {
            return {
                success: false,
                message: 'Invalid contact ID'
            };
        }

        const updates = {};

        if (name !== null) updates.name = name;
        if (age !== null) updates.age = age;

        const contact = await Contact.findByIdAndUpdate(
        new ObjectId(id),
        { $set: updates },
        { returnDocument: 'after', runValidators: true }
    );

        if (!contact) {
            return {
                success: false,
                message: 'Contact not found'
            };
        }

        return {
            success: true,
            data: contact
        };
    } catch (err) {
        return {
            success: false,
            message: 'Error updating contact: ' + err.message
        };
    }
}

// Remove an existing contact
export async function removeContact(id) {
    try {
        if (!ObjectId.isValid(id)) {
            return {
                success: false,
                message: 'Invalid contact ID'
            };
        }

        const contact = await Contact.findByIdAndDelete(
            new ObjectId(id)
        );

        if (!contact) {
            return {
                success: false,
                message: 'Contact not found'
            };
        }

        return {
            success: true,
            data: contact
        };
    } catch (err) {
        return {
            success: false,
            message: 'Error removing contact: ' + err.message
        };
    }
}
