import {create } from 'zustand'

const useUserProfileStore = create ((set) => ({
    userProfile:null,
    setUserProfile:(userProfile) => set({userProfile}),
    posts: [],
    setPosts: (posts) => set({ posts }),
}))

export default useUserProfileStore;