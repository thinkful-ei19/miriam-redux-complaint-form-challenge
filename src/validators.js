export const required = value => value ? undefined : 'Required';
export const nonEmpty = value => (value && value.trim()) !== '' ? undefined : 'Cannot be empty';
export const numeric = value => !isNaN(+value)  ? undefined : 'Must be number';
export const length5 = value => value.length === 5 ? undefined : 'Must be 5 digits'
// Uses a regular expression (regex) to check whether it looks enough like an
// email address.  Broken down:
// ^ Matches the start the text
// \S+ Matches one or more non-whitespace characters before the @
// @ A literal at sign
// \S+ Matches one or more non-whitespace characters after the @
// $ Matches the end of the text
// export const email = value =>
//     /^\S+@\S+$/.test(value) ? undefined : 'Must be a valid email address';
