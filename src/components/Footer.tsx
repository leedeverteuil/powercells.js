import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 p-5 border-t border-colors z-[3] dark:bg-zinc-950 bg-white w-[calc(100%-27rem)]">
      <Tabs defaultValue="sheets">
        <TabsList>
          <TabsTrigger value="sheets">Sheets</TabsTrigger>
          <TabsTrigger value="console">Console</TabsTrigger>
        </TabsList>

        {/* all example sheets will be visible here */}
        <TabsContent value="sheets">
          Make changes to your account here.
        </TabsContent>

        {/* console will be visible here */}
        <TabsContent value="console">Debugging stuff todo</TabsContent>
      </Tabs>
    </footer>
  );
};

export default Footer;
