
let users = [];

const checkValidate = (n, allUsers, course, edit = false, lastUsername = '') => {
  const e = {};
  try {
    users = allUsers;
  } catch (error) {
    console.log(error);
  }
  if (edit) {
    const u = validateUsernameEdit(n.username, lastUsername);
    const p = validatePassword(n.password);
    const nm = validateName(n.name);
    const ln = validateLastName(n.lastName);
    const c = validateCity(n.city);
    const t = validateTelephone(n.telephone);
    const em = validateEmail(n.email);
    const g = validateGender(n.gender);
    const r = validateRolUser(n.rolUser);
    if (u) e.username = u;
    if (p) e.password = p;
    if (nm) e.name = nm;
    if (ln) e.lastName = ln;
    if (c) e.city = c;
    if (t) e.telephone = t;
    if (em) e.email = em;
    if (g) e.gender = g;
    if (r) e.rolUser = r;
    if (n.rolUser == 'STUDENT') {
      if (!course || course == null) e.course = 'Debes seleccionar un curso';
    }
  } else {
    const u = validateUsername(n.username);
    const p = validatePassword(n.password);
    const nm = validateName(n.name);
    const ln = validateLastName(n.lastName);
    const c = validateCity(n.city);
    const t = validateTelephone(n.telephone);
    const em = validateEmail(n.email);
    const g = validateGender(n.gender);
    const r = validateRolUser(n.rolUser);
    if (u) e.username = u;
    if (p) e.password = p;
    if (nm) e.name = nm;
    if (ln) e.lastName = ln;
    if (c) e.city = c;
    if (t) e.telephone = t;
    if (em) e.email = em;
    if (g) e.gender = g;
    if (r) e.rolUser = r;
    if (n.rolUser == 'STUDENT') {
      if (course == '' || course == null) e.course = 'Debes seleccionar un curso';
    }
  }
  console.log(e);
  return e;
};

// Método auxiliar
const checkUsernameExist = (username) => {
  const usersLC = users.map((user) => user.username.toLowerCase());
  const userExists = usersLC.some((user) => user == username);
  return userExists;
};

const validateUsername = (username) => {
  const usernameLC = username.toLowerCase();
  const userExist = checkUsernameExist(usernameLC);
  if (userExist) return 'El nombre de usuario ya existe';
  if (username.length < 1) return 'El nombre de usuario debe tener al menos 1 carácter';
  return '';
};

const validateUsernameEdit = (username, lastUsername) => {
  const usernameLC = username.toLowerCase();
  const lastUsernameLC = lastUsername.toLowerCase();
  const userExist = checkUsernameExist(usernameLC);
  if (usernameLC != lastUsernameLC) {
    if (userExist) return 'El nombre de usuario ya existe';
  }
  if (username.length < 1) return 'El nombre de usuario debe tener al menos 1 carácter';
  return '';
};

const validatePassword = (p) => {
  const r = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!r.test(p)) return 'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula y una minúscula';
  return '';
};

const validateName = (n) => {
  if (n.length < 3) return 'El nombre debe tener al menos 3 caracteres';
  return '';
};

const validateLastName = (l) => {
  if (l.length < 3) return 'El apellido debe tener al menos 3 caracteres';
  return '';
};

const validateCity = (c) => {
  if (!c) return 'Debes seleccionar una ciudad';
  return '';
};

const validateTelephone = (t) => {
  const r = /^[0-9]{9}$/;
  if (!r.test(t)) return 'El teléfono debe tener 9 dígitos';
  return '';
};

const validateEmail = (e) => {
  const r = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (!r.test(e)) return 'El email debe tener un formato válido';
  else if (e.length < 3) return 'El email debe tener al menos 3 caracteres';
  return '';
};

const validateGender = (g) => {
  if (!g) return 'Debes seleccionar un género';
  return '';
};

const validateRolUser = (r) => {
  if (!r) return 'Debes seleccionar un rol';
  return '';
};

const validateAvatar = () => '';

export default {
  validateUsername,
  validatePassword,
  validateName,
  validateLastName,
  validateCity,
  validateTelephone,
  validateEmail,
  validateGender,
  validateRolUser,
  validateAvatar,
  checkValidate
};