import { useWindowSize } from 'react-use';

export const useIsMobile = () => {
  const {width} = useWindowSize();

  return width < 900;
};
