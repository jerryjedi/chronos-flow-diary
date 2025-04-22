
import React from 'react';
import { Calendar, ListTodo, Tags } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup
} from '@/components/ui/sidebar';

const Sidebar = () => {
  return (
    <ShadcnSidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold">Chronos Flow</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="gap-2">
                <Link to="/">
                  <Calendar className="h-4 w-4" />
                  <span>Calendar</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="gap-2">
                <Link to="/tasks">
                  <ListTodo className="h-4 w-4" />
                  <span>Tasks</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="gap-2">
                <Link to="/categories">
                  <Tags className="h-4 w-4" />
                  <span>Categories</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <p className="text-xs text-muted-foreground text-center">
          ChronosFlow v1.0
        </p>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
