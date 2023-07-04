import { useState, useEffect } from "react";
import { auth, db } from "../../utils/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import sendEmail from "../../utils/email";
import today from "../../utils/getDate";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useOutletContext } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addNotif, TaskStatus } from "../../utils/notifSlice";

export default function NewTask({ setNewTask }) {
  const [form, setForm] = useState({
    task: "",
    desc: "",
    date: "",
  });
  const [authData, setAuthData] = useOutletContext(); //read auth data from _applayout.jsx
  const dispatch = useDispatch();
  let tomail = authData?.email;
  let tosubject = "New Task Added";
  let totext = `Hi ${authData?.displayName}, you have added a new task. Task: ${form.task} Description: ${form.desc} Date: ${form.date}`;
  const addTask = async () => {
    const dataDoc = await getDoc(doc(db, "users", auth.currentUser.uid));

    if (dataDoc.exists()) {
      const currentTaskNo = dataDoc.data().totalTasks;
      addDoc(collection(db, "users/" + auth.currentUser.uid + "/tasks"), {
        task: form.task,
        desc: form.desc,
        date: form.date,
        completed: false,
        taskNo: currentTaskNo + 1,
      }).then(() => {
        updateDoc(doc(db, "users", auth.currentUser.uid), {
          totalTasks: currentTaskNo + 1,
        });
        setNewTask(false);
      });
    } else {
      addDoc(collection(db, "users/" + auth.currentUser.uid + "/tasks"), {
        task: form.task,
        desc: form.desc,
        date: form.date,
        completed: false,
        taskNo: 1,
      }).then(() => {
        setDoc(doc(db, "users", auth.currentUser.uid), {
          totalTasks: 1,
          completedTasks: 0,
          deletedTasks: 0,
        });
        fetchData(); //update page
        setNewTask(false);
      });
    }
  };

  const notifState = useSelector(state => state.notify.events);
  return (
    < form
      className="absolute w-3/4 h-5/6 flex flex-col justify-center items-center gap-5 p-5 bg-slate-300 dark:bg-slate-700 rounded-2xl taskform"
      onSubmit={(e) => {
        e.preventDefault();
        addTask();
        const notifTask = {
          desc: form.task,
          id: (notifState ? notifState.length : 0),
          status: TaskStatus.Add,
          read: false,
        };
        dispatch(addNotif(notifTask));
        sendEmail(tomail, tosubject, totext);
      }
      }
    >
      <div
        className="flex items-center absolute right-0 top-0 p-1 m-3 rounded bg-red-500 hover:bg-red-700 cursor-pointer text-white"
        onClick={() => {
          setNewTask(false);
        }}
      >
        <Cross1Icon />
      </div>
      <input
        type="text"
        required
        className="formInput text-base"
        placeholder="Task ( eg: TOC Assignment )"
        onChange={(e) =>
          setForm({
            ...form,
            task: e.target.value,
          })
        }
      />
      <textarea
        name=""
        id=""
        cols="30"
        rows="3"
        className="rounded p-2 text-base text-white dark:text-black outline-none"
        placeholder="Description"
        onChange={(e) =>
          setForm({
            ...form,
            desc: e.target.value,
          })
        }
      ></textarea>
      <div>
        <label htmlFor="" className="mr-5">
          due date
        </label>
        <input
          type="date"
          className="formInput text-sm"
          min={today}
          onChange={(e) =>
            setForm({
              ...form,
              date: e.target.value,
            })
          }
        />
      </div>
      <input
        type="submit"
        className="p-2 bg-green-700 hover:bg-green-800 cursor-pointer rounded"
        value="Add Task"
      />
    </form >
  );
}
