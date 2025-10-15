import {useToast} from '@chakra-ui/react'
import {useCallback} from 'react'

//useCallback to prevent inf loop by caches function
const useShowToast = () => {
    const toast = useToast()
    const showToast = useCallback((title, description, status) => {
        toast({
            title:title,
            description:description,
            status:status,
            duration: 3000,
            isClosable: true,
        });
    }, [toast])
    return showToast;
};

export default useShowToast
