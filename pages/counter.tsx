import React, { useState } from "react";
import Layout from "../components/layout";

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <Layout>
      <h1>Current value: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </Layout>
  );
};

export default Counter;
