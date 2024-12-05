import { createContext } from "react";
import { ModalProp } from "../shared";

export const FilterModalContext = createContext<{
  filterStudentsByModalRef: React.RefObject<ModalProp>;
  filterStudentsByPercentageModalRef: React.RefObject<ModalProp>;
  filterStudentsByLevelModalRef: React.RefObject<ModalProp>;
}>({
  filterStudentsByModalRef: { current: { setVisible(a) {} } },
  filterStudentsByPercentageModalRef: { current: { setVisible(a) {} } },
  filterStudentsByLevelModalRef: { current: { setVisible(a) {} } },
});
