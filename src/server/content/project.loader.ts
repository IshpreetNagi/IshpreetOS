import "server-only";

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseProjectMarkdown } from "@/server/content/project.parser";
import { projectCollectionSchema } from "@/server/content/project.schema";
import type { ProjectContent } from "@/server/content/project.schema";
