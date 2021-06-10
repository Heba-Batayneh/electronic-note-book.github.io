import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import './App.css';
import Preview from './components/preview';
import Message from './components/message/index';
import NotesContainer from './components/Notes/notesContainer';
import NoteList from './components/Notes/notesList';
import Note from './components/Note/Note';
import NoteForm from './components/NoteForm/NoteForm';
import Alert from './components/Alert/index';

function App() {

    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedNote, setSelectedNote] = useState(null);
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);


    // لحفظ البيانات في الذاكرة المحلية 
    useEffect(() => {
        if (localStorage.getItem('notes')) {
            setNotes(JSON.parse(localStorage.getItem('notes')));
        }
        else {
            // تحويل مصفوفة جافا سكريبت الى مصفوفة نصيه باستخدام stringfy
            localStorage.setItem('notes', JSON.stringify([]));
        }
        // تم وضع مصفوفة فارغة في هنا حتى يتم تصيير المتغير مره واحدة وتنفيذها مرة واحده فقط 
    }, []);

    useEffect(() => {
        if (validationErrors.length !== 0) {
            setTimeout(() => {
                // اعادة قيمة المصفوفة الى القيمة الابتدائية وهي ان تكون فارغة بعد 3 ثواني
                setValidationErrors([]);
            }, 3000)
        }
    })

    const saveToLocalStorage = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    //تصحيح الاخطاء 
    const validate = () => {
        const validationErrors = [];
        let passed = true;
        if (!title) {
            validationErrors.push("الرجاء إدخال عنوان الملاحظة");
            passed = false;
        }

        if (!content) {
            validationErrors.push("الرجاء إدخال محتوى الملاحظة");
            passed = false;
        }

        setValidationErrors(validationErrors);
        return passed;
    }

    // تغيير عنوان الملاحظة 
    const changeTitleHandler = (event) => {
        setTitle(event.target.value);
    }
    // تعديل محتوى الملاحظة 
    const changeContentHandler = (event) => {
        setContent(event.target.value);
    }
    // حفظ بطاقة الملاحظة 
    const saveNoteHandler = () => {
        //في حال تم ادخال العنوان والمحتوى يتم حفظ الملاحظة 
        if (!validate()) return;

        const note = {
            id: new Date(),
            title: title,
            content: content
        }
        // نضيف كل الملاحظات في المصنوفة نوتس قبل عن طريق كتابة ...notes
        // وثم الملاحظة المضافة جديدا
        const updatedNotes = [...notes, note];
        // عرض البطاقة المضافة في قائمة البطاقات 
        saveToLocalStorage('notes', updatedNotes);
        setNotes(updatedNotes);
        // لاعاده واجهه المتصفح الى قائمة عرض بطاقات الملاحظات
        setCreating(false);
        // اضافة بطاقة الملاحظة الجديده في القائمة 
        setSelectedNote(note.id);
        //لافراغ محتويات بطاقة الملاحظة 
        setTitle('');
        setContent('');
    }

    // اختيار ملاحظة 
    const selectNoteHandler = (noteId) => {
        setSelectedNote(noteId);
        // حتى لا يظهر واجهة الانشاء ولا واجهة التعديل 
        setEditing(false);
        setCreating(false);
    }

    // الانتقال لمرحلة تعديل الملاحظة 
    const editNoteHandler = noteId => {
        // هون رح يحدد الملاحظة المختاره
        const note = notes.find(note => note.id === selectedNote);
        setEditing(true);
        setTitle(note.title);
        setContent(note.content);
    }

    // حفظ تعديلات الملاحظات
    const updateNoteHandler = () => {

        //في حال تم ادخال العنوان والمحتوى يتم حفظ تعديل الملاحظة 
        if (!validate()) return;

        //ترجع المصفوفة الملاحظات 
        const updatedNotes = [...notes];
        //تحديد الملاحظة المختارة التي يتم تعديلها 
        const noteIndex = notes.findIndex(note => note.id === selectedNote);
        updatedNotes[noteIndex] = {
            id: selectedNote,
            title: title,
            content: content
        };
        saveToLocalStorage('notes', updatedNotes);
        setNotes(updatedNotes);
        setEditing(false);
        setTitle('');
        setContent('');
    }

    // اضافة بطاقة جديدة في حال النقر على زر + الموجود 
    const addNoteHandler = () => {
        setCreating(true);
        //حتى يخرج من واجهة تعديل النافذة 
        setEditing(false);
        setTitle('');
        setContent('');
    }

    // وظيفة زر حذف الملاحظة
    const deletNoteHandler = () => {
        const updatedNotes = [...notes];
        const noteIndex = updatedNotes.findIndex(note => note.id === selectedNote);
        notes.splice(noteIndex, 1);
        saveToLocalStorage('notes', notes);
        setNotes(notes);
        setSelectedNote(null);

    }


    const getAddNote = () => {
        return (
            <NoteForm
                formTitle="ملاحظة جديدة"
                title={title}
                content={content}
                titleChanged={changeTitleHandler}
                contentChanged={changeContentHandler}
                submitClicked={saveNoteHandler}
                submitText="حفظ"
            />
        );
    }

    const getPreview = () => {
        // في حال لم يتم اضافة بطاقات
        if (notes.length === 0) {
            return <Message title="لا يوجد ملاحظات" />
        }
        // في حال لم يتم اختيار بطاقة لعرضها 
        if (!selectedNote) {
            return <Message title="الرجاء اختيار ملاحظة" />
        }
        // لعرض البطاقة المختارة من قائمة الملاحظات
        const note = notes.find(note => {
            return note.id === selectedNote;
        });

        let noteDisplay = (
            <div>
                <h2>{note.title}</h2>
                <p>{note.content}</p>
            </div>
        )

        if (editing) {
            noteDisplay = (
                <NoteForm
                    formTitle="تعديل ملاحظة"
                    title={title}
                    content={content}
                    titleChanged={changeTitleHandler}
                    contentChanged={changeContentHandler}
                    submitText="تعديل"
                    submitClicked={updateNoteHandler}
                />

            );
        }

        return (
            <div>
                {/* هون في حال ما صار في تعديل نفذ اللي بعد اشارات اند  */}
                {!editing &&
                    <div className="note-operations">
                        <a href="#" onClick={editNoteHandler}>
                            <i className="fa fa-pencil-alt" />
                        </a>
                        <a href="#" onClick={deletNoteHandler}>
                            <i className="fa fa-trash" />
                        </a>
                    </div>
                }
                {noteDisplay}
            </div>
        );
    };


    return (
        <div className="App">
            <NotesContainer>
                <NoteList>
                    {/* لعرض قائمة الملاحظات و ماب للانتقال بين عناصر المصفوفة */}
                    {notes.map(note =>
                        <Note
                            key={note.id}
                            title={note.title}
                            noteClicked={() =>
                                selectNoteHandler(note.id)}
                            // في حال كانت الملاحظة فعالة اضافة تنسيقات خاصه تكتب كملة 
                            // if
                            // بهذه الطريقة 
                            active={selectedNote === note.id}
                        />)}
                </NoteList>
                <button className="add-btn" onClick={addNoteHandler}> + </button>
            </NotesContainer>
            <Preview>
                {creating ? getAddNote() : getPreview()}
            </Preview>

            {validationErrors.length !== 0 && <Alert validationMessages= {validationErrors} />}

        </div>
    );
}

export default App;
