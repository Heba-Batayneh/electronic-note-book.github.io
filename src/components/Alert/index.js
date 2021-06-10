import React from 'react';
// الفائدة من بروبس جد التنفيذ ديناميكي للعناصر اي ينفذ بشكل تلقائي 
const Alert = (props) => (
    <div className="alert-container">
        <ul>
            {props.validationMessages.map((message, index) => <li key={index}>{message}</li>)}
        </ul>
    </div>

);

export default Alert ;