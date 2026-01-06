import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Type,
  Image,
  Grid,
  MessageCircle,
  Info,
  Mail,
  Copyright,
  Minus,
} from "lucide-react";
import {
  createHeaderBlock,
  createHeroBlock,
  createFeaturesBlock,
  createTestimonialsBlock,
  createAboutBlock,
  createContactFormBlock,
  createFooterBlock,
  createSectionSpacerBlock,
} from "./utils";
import { LandingPageBlock } from "./types";

interface BlocksPanelProps {
  onAddBlock: (block: LandingPageBlock) => void;
}

interface BlockTemplate {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  onCreate: () => LandingPageBlock;
}

export const BlocksPanel: React.FC<BlocksPanelProps> = ({ onAddBlock }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const blockTemplates: BlockTemplate[] = [
    {
      id: "header",
      icon: <Type className="w-6 h-6 text-valasys-orange" />,
      label: "Header",
      description: "Navigation header with logo and menu",
      onCreate: createHeaderBlock,
    },
    {
      id: "hero",
      icon: <Image className="w-6 h-6 text-valasys-orange" />,
      label: "Hero Section",
      description: "Large banner with headline and CTA",
      onCreate: createHeroBlock,
    },
    {
      id: "features",
      icon: <Grid className="w-6 h-6 text-valasys-orange" />,
      label: "Features",
      description: "Showcase features in a grid layout",
      onCreate: createFeaturesBlock,
    },
    {
      id: "testimonials",
      icon: <MessageCircle className="w-6 h-6 text-valasys-orange" />,
      label: "Testimonials",
      description: "Customer testimonials and reviews",
      onCreate: createTestimonialsBlock,
    },
    {
      id: "about",
      icon: <Info className="w-6 h-6 text-valasys-orange" />,
      label: "About",
      description: "About company section",
      onCreate: createAboutBlock,
    },
    {
      id: "contact",
      icon: <Mail className="w-6 h-6 text-valasys-orange" />,
      label: "Contact Form",
      description: "Email contact form",
      onCreate: createContactFormBlock,
    },
    {
      id: "footer",
      icon: <Copyright className="w-6 h-6 text-valasys-orange" />,
      label: "Footer",
      description: "Footer with links and info",
      onCreate: createFooterBlock,
    },
    {
      id: "spacer",
      icon: <Minus className="w-6 h-6 text-valasys-orange" />,
      label: "Spacer",
      description: "Add vertical spacing",
      onCreate: createSectionSpacerBlock,
    },
  ];

  const filteredBlocks = blockTemplates.filter(
    (block) =>
      block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col bg-white w-full h-full overflow-hidden">
      <Tabs defaultValue="blocks" className="flex flex-col h-full overflow-hidden">
        <TabsList className="sticky top-0 z-20 flex w-full h-auto rounded-none border-b border-gray-200 bg-white p-0 flex-shrink-0">
          <TabsTrigger
            value="blocks"
            className="flex-1 rounded-none px-4 py-3 text-gray-600 border-b-2 border-transparent data-[state=active]:border-valasys-orange data-[state=active]:text-gray-900 data-[state=active]:bg-white shadow-none"
          >
            Blocks
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="flex-1 rounded-none px-4 py-3 text-gray-600 border-b-2 border-transparent data-[state=active]:border-valasys-orange data-[state=active]:text-gray-900 data-[state=active]:bg-white shadow-none"
          >
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blocks" className="flex flex-col m-0 flex-1 overflow-hidden">
          <div className="p-4 border-b border-gray-200 sticky top-[52px] bg-white z-20">
            <Input
              placeholder="Search blocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <div className="space-y-3">
              {filteredBlocks.map((block) => (
                <Button
                  key={block.id}
                  onClick={() => onAddBlock(block.onCreate())}
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4 flex-col items-start border border-gray-200 hover:border-valasys-orange hover:bg-orange-50"
                >
                  <div className="flex items-center w-full mb-2">
                    <div className="mr-3">{block.icon}</div>
                    <span className="font-medium text-gray-900">
                      {block.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 ml-9">
                    {block.description}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="flex flex-col m-0 flex-1 overflow-hidden">
          <div className="p-4 overflow-y-auto flex-1">
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <h3 className="font-medium text-gray-900 mb-2">
                  Landing Page Templates
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Pre-built landing page templates coming soon. For now, use
                  individual blocks to create your page.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
