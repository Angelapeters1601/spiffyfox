import { useEffect } from "react";
import trackVisitor from "../services/trackVisitor";

export const useTrackVisitor = ({ trackOnMount = true } = {}) => {
  useEffect(() => {
    if (trackOnMount) trackVisitor.track();
  }, [trackOnMount]);
};
