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
import { IUserData } from "./interfaces/iuser"
import { getSession } from "@/lib/sessions-client"
import { usePathname } from "next/navigation"
import LoadingScreen from "./general/loading-screen"
import { roles } from "@/db/schema/libraries"
import { permission } from "process"
import path from "path"

const data = {
  user: {
    name: "",
    email: "",
    avatar: "/avatars/shadcn.jpg",
    role:""
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
    },
    {
      name: "Human Resource and Development",
      logo: User2Icon,
      plan: "Configuration",
      url: "/hr-development",
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
          url:"/subproject/geotagging",
          permission:["Can View","Can Delete"]
        }
      ],
      modules: ["Sub-Project"],
      roles:["Administrator"]
    },
    {
      title:"Tasks",
      url:"#",
      icon: Earth,
      items: [
        {
          title: "Masterlist",
          url:"/subproject/tasks",
          permission:["Can Add","Can View","Can Delete"]
        }
      ],
      modules: ["Sub-Project"],
      roles:["Administrator"]

    },
    {
      title:"Libraries",
      url:"#",
      icon:Library,
      items:[
        {
          title: "Roles",
          url:"/settings/libraries/roles",
          permission:["Can Add","Can View","Can Delete"]
        },
        {
          title: "Permissions",
          url:"/settings/libraries/permissions",
          permission:["Can Add","Can View","Can Delete"]
        },
        {
          title: "Modules",
          url:"/settings/libraries/modules",
          permission:["Can Add","Can View","Can Delete"]
        }
      ],
      modules:["Settings"],
      roles:["Administrator"]

    },
    {
      title:"Users",
      url:"#",
      icon: Library,
      items:[
        {
          title: "Masterlist",
          url:"/settings/users",
          permission:["Can Add","Can View","Can Delete"]
        }
      ],
      modules:["Settings"],
      roles:["Administrator"]

    },
    {
      title: "Profile",
      url: "#",
      icon: User2Icon,
      isActive: false,
      items:[
        {
          title: "My Profile",
          url:"/personprofile/form",
          permission:["Can Add","Can View","Can Delete"]
        },
        {
          title: "Masterlist",
          url:"/personprofile/masterlist",
          permission:["Can View","Can Delete"]
        },
        {
          title: "User Masterlist",
          url:"/personprofile/user-masterlist",
          permission:["Can View","Can Delete"]
        },
        {
          title: "Daily Time Record",
          url:"/personprofile/daily-time-record",
          permission:["Can Add","Can View","Can Delete"]
        },
        {
          title: "Accomplishment Report",
          url:"/personprofile/accomplishment-report",
          permission:["Can Add","Can View","Can Delete"]
        },
        {
          title: "Payroll",
          url:"/personprofile/payroll",
          permission:["Can Add","Can View","Can Delete"]
        }
      ],
      modules: ["Person Profile"],
      roles:["*"]
    },
    {
      title: "CFW Management",
      url: "#",
      icon: User2Icon,
      isActive: false,
      items:[
        {
          title: "Work Plans",
          url:"/personprofile/work-plan",
          permission:["Can Add","Can View","Can Delete"],
        },
       
      ],
      roles: ["CFW Administrator","Administrator"],
      modules: ["Person Profile"],
    },
    {
      title: "Position: Item Created",
      url: "",
      icon: User2Icon,
      isActive: false,
      items:[
        {
          title:"Masterlist",
          url:"/hr-development/item-created",
          permission:["Can View","Can Delete"]
        }
      ],
      modules: ["Human Resource and Development"],
      roles:["Administrator"]
    },
    {
      title: "Position: Item Distribution",
      url:"#",
      icon: User2Icon,
      isActive: false,
      items:[
        {
          title:"Hiring Procedures and Status",
          url:"#",
          permission:["Can View","Can Delete"]
        },
        {
          title:"Application Status",
          url:"#",
          permission:["Can View","Can Delete"]
        },
        {
          title:"Employee Personal Data Sheet",
          url:"#",
          permission:["Can View","Can Delete"]
        }
      ],
      modules: ["Human Resource and Development"],
      roles:["Administrator"]
    }
  ],
  projects: [
    {
      name: "Update Library",
      url: "/library",
      icon: Frame,
      pathname: ["*"],
      roles:["*"]
    },
    {
      name: "Attendance",
      url: "/punch",
      icon: Frame,
      pathname: ["personprofile"],
      roles:["CFW Administrator","Administrator"]
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeTeam, setActiveTeam] = React.useState<Team>(data.teams[0]);
  const [filteredTeam, setFilteredTeam] = React.useState<Team[]>([]);
  const [filteredNavMain, setFilteredNavMain] = React.useState(data.navMain);
  const [filteredSub, setFilteredSub] = React.useState(data.navMain)
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState(data.user);
  const [userTeam, setUserTeam] = React.useState<IUserData>();
  const pathname = usePathname();

  React.useEffect(() => {
    async function loadUserData() {
      setIsLoading(true);
      const _session = await getSession() as SessionPayload;
      //const session = (await response.json()) as SessionPayload;
      console.log("SideBar Session: ", _session);
      if(_session != null){
        user.email = _session.userData.email!;
        user.name = _session.userData.name!;
        user.role = _session.userData.role!;
        const userTeams = _session.userData; 
        // debugger;
        setUserTeam(userTeams);      
        // debugger;
        const navTeam = data.teams.filter((team) =>
          userTeams?.userAccess?.some((mod) => mod.module === team.name)
        );
  
        setFilteredTeam(navTeam);
        const defaultTeam = navTeam.some(team => pathname?.includes(team.url)) ? navTeam.find(team => pathname?.includes(team.url))! : navTeam[0];
        setActiveTeam(defaultTeam);
        setIsLoading(false);
        setUser(user);
      }
    }
    loadUserData();
  }, []);

  React.useEffect(() => {
    async function loadNavMain(){
        // Filter para sa module
        const navMain = data.navMain.filter(
          (nav) =>
            nav.modules.includes(activeTeam?.name) // Filter based on active team
        );  

        debugger;
        const filteredSubModule = data.navMain.filter(item => 
          item.modules.includes(activeTeam?.name) &&
          (
            item.roles?.includes("*") || // Allow all roles
            item.roles?.some(role => userTeam?.role?.includes(role))
          )
        );

        const filteredChildModule = filteredSubModule
        .map(module => ({
          ...module,
          items: module.items?.filter(permissions => 
            userTeam?.userAccess?.some(access =>
                access.permission && permissions.permission.includes(access.permission)
              )
          )
        }))
        .filter(module => module.items && module.items.length > 0);

        setFilteredNavMain(navMain);
        setFilteredSub(filteredChildModule)
    }

    loadNavMain();
  }, [activeTeam])

  const matchedProjects = data.projects.filter(project => {
    const matchesPath = project.pathname.includes("*") ||
      project.pathname.some(path => pathname?.toLowerCase().includes(path.toLowerCase()));
  
    const matchesRole = project.roles.includes("*") ||
      project.roles.some(role => user.role.includes(role));
  
    return matchesPath && matchesRole;
  });
  

  return (
    <>
      {!isLoading ? (
        <Sidebar collapsible="icon" {...props}>
          <SidebarHeader>
            <TeamSwitcher
              teams={filteredTeam}  
              activeTeam={activeTeam ?? data.teams.some(team => pathname?.includes(team.url)) ? data.teams.find(team => pathname?.includes(team.url))! : data.teams[0]}
              onChange={setActiveTeam}
            />
          </SidebarHeader>
          <SidebarContent>
            {/* <p>Active Team: {JSON.stringify(team)}</p> */}
            <NavMain items={filteredSub} />
            <NavProjects projects={matchedProjects} />
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={data.user} />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
      ) :
      (
        <LoadingScreen
          isLoading={isLoading}
          text={"Loading... Please wait."}
          style={"dots"}
          fullScreen={true}
          progress={0}
          timeout={0}
          onTimeout={() => console.log("Loading timed out")}
        />
      )}
    </>
  )
}