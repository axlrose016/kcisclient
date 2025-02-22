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
import { useRouter } from 'next/navigation'

const data = {
  user: {
    name: "",
    email: "",
    avatar: "/avatars/shadcn.jpg",
    role: ""
  },
  teams: [
    { name: "Sub-Project", logo: GalleryVerticalEnd, plan: "Enterprise", url: "/subproject" },
    { name: "Person Profile", logo: User2Icon, plan: "Team", url: "/personprofile" },
    { name: "Settings", logo: Command, plan: "Configuration", url: "/settings" },
  ],
  navMain: [
    { title: "Geotagging", url: "#", icon: Earth, items: [{ title: "Masterlist", url: "/subproject/geotagging", permission: ["Can View", "Can Delete"] }], modules: ["Sub-Project"] },
    { title: "Tasks", url: "#", icon: Earth, items: [{ title: "Masterlist", url: "/subproject/tasks", permission: ["Can Add", "Can View", "Can Delete"] }], modules: ["Sub-Project"] },
    { title: "Libraries", url: "#", icon: Library, items: [{ title: "Roles", url: "/settings/libraries/roles", permission: ["Can Add", "Can View", "Can Delete"] }, { title: "Permissions", url: "/settings/libraries/permissions", permission: ["Can Add", "Can View", "Can Delete"] }, { title: "Modules", url: "/settings/libraries/modules", permission: ["Can Add", "Can View", "Can Delete"] }], modules: ["Settings"] },
    { title: "Users", url: "#", icon: Library, items: [{ title: "Masterlist", url: "/settings/users", permission: ["Can Add", "Can View", "Can Delete"] }], modules: ["Settings"] },
    { title: "Profile", url: "#", icon: User2Icon, items: [{ title: "My Profile", url: "/personprofile/form", permission: ["Can Add", "Can View", "Can Delete"] }, { title: "Masterlist", url: "/personprofile/masterlist", permission: ["Can View", "Can Delete"] }, { title: "DTR", url: "#", permission: ["Can Add", "Can View", "Can Delete"] }], modules: ["Person Profile"] },
  ],
  projects: [{ name: "Update Library", url: "/library", icon: Frame }],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeTeam, setActiveTeam] = React.useState<Team>(data.teams[0]);
  const [filteredTeam, setFilteredTeam] = React.useState<Team[]>([]);
  const [filteredNavMain, setFilteredNavMain] = React.useState(data.navMain);
  const [filteredSub, setFilteredSub] = React.useState(data.navMain);
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(data.user);
  const [userTeam, setUserTeam] = React.useState<IUserData | null>(null);
  const [session, setSession] = React.useState<SessionPayload | null>(null);
  const router = useRouter()

  React.useEffect(() => {
    async function loadUserData() {
      setIsLoading(true);
      const _session = await getSession() as SessionPayload;
      if (!_session) {
        router.push("/login");
        return;
      }

      // Set session and user data
      setSession(_session);
      setUser({
        email: _session.userData.email!,
        name: _session.userData.name!,
        role: _session.userData.role!,
        avatar: "/avatars/shadcn.jpg", // Dynamically set avatar if needed
      });

      setUserTeam(_session.userData);

      // Filter teams based on user's access rights
      const navTeam = data.teams.filter((team) =>
        _session.userData.userAccess?.some((mod) => mod.module === team.name)
      );
      setFilteredTeam(navTeam);
      setActiveTeam(navTeam[0]);
      setIsLoading(false);
    }

    loadUserData();

    // Cleanup effect
    return () => {
      setIsLoading(false);
    };
  }, [router]);

  React.useEffect(() => {
    async function loadNavMain() {
      if (userTeam) {
        const navMain = data.navMain.filter(
          (nav) => nav.modules.includes(activeTeam.name)
        );

        const filteredSubModule = navMain.map(module => ({
          ...module,
          items: module.items.filter(permission =>
            userTeam?.userAccess?.some(access =>
              access.permission && permission.permission.includes(access.permission)
            )
          )
        })).filter(module => module.items.length > 0); // Only include modules with valid permissions

        setFilteredNavMain(navMain);
        setFilteredSub(filteredSubModule);
      }
    }

    if (activeTeam && userTeam) {
      loadNavMain();
    }
  }, [activeTeam, userTeam]);

  return (
    <>
      {!isLoading ? (
        <Sidebar collapsible="icon" {...props}>
          <SidebarHeader>
            <TeamSwitcher
              teams={filteredTeam}
              activeTeam={activeTeam}
              onChange={setActiveTeam}
            />
          </SidebarHeader>
          <SidebarContent>
            <NavMain items={filteredSub} />
            <NavProjects projects={data.projects} />
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={user} />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
      ) : (
        <Sidebar collapsible="icon" {...props}>
          <h1>Loading Please Wait!!</h1>
        </Sidebar>
      )}
    </>
  );
}
