import React from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
  SidebarHeading,
} from "@/components/sidebar";

import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  HomeIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ListIcon,
} from "@heroicons/react/20/solid";

const SidebarComponent = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarSection>
          <SidebarItem href="/home">
            <HomeIcon />
            <SidebarLabel>Home</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/search">
            <MagnifyingGlassIcon />
            <SidebarLabel>Search</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/inbox">
            <InboxIcon />
            <SidebarLabel>Inbox</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          <SidebarItem href="/events">
            <MegaphoneIcon />
            <SidebarLabel>Events</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/orders">
            <ShieldCheckIcon />
            <SidebarLabel>Orders</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/settings">
            <Cog6ToothIcon />
            <SidebarLabel>Settings</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
        <SidebarSpacer />
        <SidebarSection>
          <SidebarHeading>Practice & Progress</SidebarHeading>
          <SidebarItem href="/practice-problems">
            <ListIcon />
            <SidebarLabel>Practice Problems</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/progress">
            <CheckCircleIcon />
            <SidebarLabel>Progress</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/analytics">
            <ChartBarIcon />
            <SidebarLabel>Analytics</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
        <SidebarSpacer />
        <SidebarSection>
          <SidebarItem href="/support">
            <QuestionMarkCircleIcon />
            <SidebarLabel>Support</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/changelog">
            <SparklesIcon />
            <SidebarLabel>Changelog</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter>
        <SidebarItem href="/profile">
          <UserIcon />
          <SidebarLabel>Profile</SidebarLabel>
        </SidebarItem>
        <SidebarItem href="/logout">
          <ArrowRightOnRectangleIcon />
          <SidebarLabel>Logout</SidebarLabel>
        </SidebarItem>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarComponent;
