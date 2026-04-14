import { createContext, useContext } from "react"

type SidebarContextType={
 collapsed : boolean,
 setCollapsed : React.Dispatch<React.SetStateAction<boolean>>
}

export const SidebarContext = createContext<SidebarContextType|null>(null);

export default function useSidebarContext(){
    const context = useContext(SidebarContext);

    if(!context) throw new Error("Null Sidebar Context");

    return context;

}