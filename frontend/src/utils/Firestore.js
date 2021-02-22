import { db } from "./base";
import firebase from "firebase/app";
const checkUserExist = async (uid) => {
  const docRef = db.collection("users").doc(uid);
  const doc = await docRef.get();

  if (!doc.exists) {
    return true;
  } else {
    return false;
  }
};

const addUser = async (uid, val) => {
  const docRef = db.collection("users").doc(uid);
  let userRole = {
    role: null,
  };
  if (val) {
    userRole.role = true;
  } else {
    userRole.role = false;
  }
  await docRef.set(userRole);
};

const addInfo = async (values, uid) => {
  const docRef = db.collection("users").doc(uid);
  await docRef.update(values);
};
const addClass = (code, uid) => {
  const docRef = db.collection("classes").doc(code);
  let data = {
    classCode: code,
    className: "Class" + code,
    owner: uid,
    students: null,
  };
  docRef.set(data);
  addClassToUser(code, uid);
};
const joinClass = async (code, uid) => {
  try {
    const classesRef = db.collection("classes").doc(code);
    await classesRef.update({
      students: firebase.firestore.FieldValue.arrayUnion(uid),
    });
    addClassToUser(code, uid);
  } catch (err) {
    return err;
  }
};
const getAllClasses = async (uid) => {
  const docRef = db.collection("users").doc(uid);
  const doc = await docRef.get();
  const { Classes } = doc.data();
  if (Classes == undefined) return null;
  const classAr = [];
  for (const code of Classes) {
    const classRef = db.collection("classes").doc(code);
    const docData = await classRef.get();
    const classData = docData.data();
    const ownerData = await getUserRole(classData.owner);
    classData["ownerName"] =
      ownerData["nickname"] != undefined ? ownerData.nickname : "Not Available";
    classAr.push(classData);
  }
  return classAr;
};
const addClassToUser = async (code, uid) => {
  const docRef = db.collection("users").doc(uid);
  await docRef.update({
    Classes: firebase.firestore.FieldValue.arrayUnion(code),
  });
};
const getUserRole = async (uid) => {
  const docRef = db.collection("users").doc(uid);
  const doc = await docRef.get();
  const data = doc.data();
  return data;
};
const getAssigments = async (classCode) => {
  const docRef = db.collection("assigments").doc(classCode);
  const doc = await docRef.get();
  let classAr = [];
  classAr.push(doc.data());
  return classAr;
};
export {
  getAssigments,
  checkUserExist,
  addUser,
  getUserRole,
  addClass,
  joinClass,
  addInfo,
  getAllClasses,
};
