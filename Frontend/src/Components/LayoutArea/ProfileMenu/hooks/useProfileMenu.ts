import { useAppSelectors } from "../../../hooks/AppSelectors/useAppSelectors";

export const useProfileMenu = () => {

    const {currentUser} = useAppSelectors()

    const getCurrentYear = (): number => {
        const date = new Date();
        const year = date.getFullYear();
        return year;
      };


    return {
        getCurrentYear,
        currentUser
    }
}