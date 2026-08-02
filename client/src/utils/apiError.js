const FIELD_LABELS = {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    password: 'Password',
};

const cleanMessage = (message) =>
    (message || 'Invalid value').replace(/"/g, '');

export const getFieldErrors = (error) => {
    const errors = error?.response?.data?.errors;
    if (!Array.isArray(errors)) return {};

    return errors.reduce((acc, { field, message }) => {
        if (field) acc[field] = cleanMessage(message);
        return acc;
    }, {});
};

export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
    const data = error?.response?.data;
    if (!data) return fallback;

    if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors
            .map(({ field, message }) => {
                const label = FIELD_LABELS[field] || field;
                return `${label}: ${cleanMessage(message)}`;
            })
            .join('. ');
    }

    return data.message || fallback;
};
