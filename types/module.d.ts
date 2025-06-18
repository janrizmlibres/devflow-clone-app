import { ClientSession } from "mongoose";
import { SearchParams } from "nuqs/server";

import {
  IInteractionDoc,
  InteractionActionEnums,
} from "@/database/interaction.model";

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<SearchParams>;
}

interface CreateInteractionParams {
  action: (typeof InteractionActionEnums)[number];
  actionTarget: "Question" | "Answer";
  actionId: string;
  authorId: string;
}

interface UpdateReputationParams {
  interaction: IInteractionDoc;
  session: ClientSession;
  performerId: string;
  authorId: string;
}
