import { useState } from 'react'

type toggleType = {
  toggle: boolean;
  handler: (value: boolean) => void;
}

export const useToggle = (initialValue: boolean): toggleType => {
  const [toggle, setToggle] = useState<boolean>(initialValue);

  const handler = (value: boolean) => {
    if(toggle !== value) {
      setToggle(value);
    }
  }

  return {toggle, handler};
}
