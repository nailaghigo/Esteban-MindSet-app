import React from 'react';
import styles from './input.module.css';

function Input({ title, id, name, placeholder, value, onChange, type, required }) {
  return (
    <div className={styles.container}>
      <label className={styles.labelTitle}>{title}</label>
      <input
        className={styles.inputContent}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={type}
        required={required}
      />
    </div>
  );
}

export default Input;
