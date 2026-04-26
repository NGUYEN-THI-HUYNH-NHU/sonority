"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-2xl font-semibold">Wellcome to Sonority</h1>
      <div className="flex items-center gap-4">
        <OrganizationSwitcher />
        <UserButton />
      </div>
    </div>
  );
};

export default Home;
