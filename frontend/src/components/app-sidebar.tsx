"use client"

import * as React from "react"
import {
  Command,
  Earth,
  Frame,
  GalleryVerticalEnd,
  Library,
  User2Icon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Team } from "./types"
import { SessionPayload } from "@/types/globals"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Sub-Project",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
      url: "/subproject",
    },
    {
      name: "Person Profile",
      logo: User2Icon,
      plan: "Team",
      url: "/personprofile",
    },
    {
      name: "Settings",
      logo: Command,
      plan: "Configuration",
      url: "/settings",
    }
  ],
  navMain: [
    {
      title: "Geotagging",
      url: "#",
      icon: Earth,
      isActive: false,
      items:[
        {
          title:"Masterlist",
          url:"/subproject/geotagging"
        }
      ],
      modules: ["Sub-Project"],
    },
    {
      title:"Tasks",
      url:"#",
      icon: Earth,
      items: [
        {
          title: "Masterlist",
          url:"/subproject/tasks"
        }
      ],
      modules: ["Sub-Project"],
    },
    {
      title:"Libraries",
      url:"#",
      icon:Library,
      items:[
        {
          title: "Roles",
          url:"/settings/libraries/roles",
        },
        {
          title: "Permissions",
          url:"/settings/libraries/permissions",
        },
        {
          title: "Modules",
          url:"/settings/libraries/modules"
        }
      ],
      modules:["Settings"],
    },
    {
      title:"Users",
      url:"#",
      icon: Library,
      items:[
        {
          title: "Masterlist",
          url:"/settings/users"
        }
      ],
      modules:["Settings"],
    },
    {
      title: "Profile",
      url: "#",
      icon: User2Icon,
      isActive: false,
      items:[
        {
          title: "My Profile",
          url:"/personprofile/form"
        },
        {
          title: "Masterlist",
          url:"/personprofile/masterlist",
          permission:["Can View","Can Delete"]
        },
        {
          title: "DTR",
          url:"#"
        }
      ],
      modules: ["Person Profile"],
    }
  ],
  projects: [
    {
      name: "Update Library",
      url: "/library",
      icon: Frame,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeTeam, setActiveTeam] = React.useState<Team>(data.teams[0]);
  const [filteredTeam, setFilteredTeam] = React.useState<Team[]>([]);
  const [filteredNavMain, setFilteredNavMain] = React.useState(data.navMain);

  React.useEffect(() => {
    async function loadUserData() {
      const response = await fetch("/api/session", { cache: "no-store" });
      if (!response.ok) {
        console.error("Failed to fetch session data");
        return;
      }
      const session = (await response.json()) as SessionPayload;

      const userTeams = session.userData[0].userAccess; 
      
      const navTeam = data.teams.filter((team) =>
        userTeams?.some(t => team.name === t.module) // Ensure we return the comparison result
      );

      // Filter para sa module
      const navMain = data.navMain.filter(
        (nav) =>
          nav.modules.includes(activeTeam.name) // Filter based on active team
      );  


      setFilteredTeam(navTeam);
      setActiveTeam(navTeam[0]);
      setFilteredNavMain(navMain);
    }

    loadUserData();
  }, [activeTeam]);

  const filteredSubModule = data.navMain.filter(item => 
    item.modules.includes(activeTeam.name) // Filter based on active team
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      <TeamSwitcher
        teams={filteredTeam}
        activeTeam={activeTeam}
        onChange={setActiveTeam}
      />   
      </SidebarHeader>
      <SidebarContent>
        {/* <p>Active Team: {JSON.stringify(team)}</p> */}
        <NavMain items={filteredSubModule} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}