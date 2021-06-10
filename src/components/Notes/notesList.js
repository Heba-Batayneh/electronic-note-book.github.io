import React from 'react';

const NoteList = (props) =>(
    <ul className="notes-list">
        {props.children}
        </ul>
)

export default NoteList ;