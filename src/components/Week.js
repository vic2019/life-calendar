import React from 'react';

export default function Week({ key, item }) {
  const weekStyle = {
    color: item.color || null
  }

  return (
    <span style={weekStyle}>{item.content}</span>
  );
}