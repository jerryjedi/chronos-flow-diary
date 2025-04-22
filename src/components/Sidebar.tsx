
import React from 'react';
import { Calendar, ListTodo, Tags, Clock } from 'lucide-react';
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
                <a href="/">
                  <Calendar className="h-4 w-4" />
                  <span>Calendar</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="gap-2">
                <a href="/tasks">
                  <ListTodo className="h-4 w-4" />
                  <span>Tasks</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="gap-2">
                <a href="/categories">
                  <Tags className="h-4 w-4" />
                  <span>Categories</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="gap-2">
                <a href="/history">
                  <Clock className="h-4 w-4" />
                  <span>History</span>
                </a>
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
