import Fastify, { type FastifyInstance, type FastifyReply } from "fastify";
import { pathToFileURL } from "node:url";
import { sql } from "./db";

type CreatePupilBody = {
  pupilName?: unknown;
  pupilClass?: unknown;
  guardianName?: unknown;
  guardianPhone?: unknown;
};

type GuardianRecord = {
  id: number;
  name: string;
  phone: string;
};

type PupilRecord = {
  id: number;
  name: string;
  class: string;
  guardian_id: number;
};

const REQUIRED_FIELDS = [
  ["pupilName", "Pupil name"],
  ["pupilClass", "Pupil class"],
  ["guardianName", "Guardian name"],
  ["guardianPhone", "Guardian phone"],
] as const;

function validateBody(body: unknown):
  | { ok: true; values: { pupilName: string; pupilClass: string; guardianName: string; guardianPhone: string } }
  | { ok: false; message: string } {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, message: "Request body must be a JSON object" };
  }

  const input = body as CreatePupilBody;
  const missing: string[] = [];

  for (const [key, label] of REQUIRED_FIELDS) {
    const value = input[key];
    if (typeof value !== "string" || value.trim() === "") {
      missing.push(label);
    }
  }

  if (missing.length > 0) {
    return {
      ok: false,
      message: `Missing or blank required field(s): ${missing.join(", ")}`,
    };
  }

  return {
    ok: true,
    values: {
      pupilName: (input.pupilName as string).trim(),
      pupilClass: (input.pupilClass as string).trim(),
      guardianName: (input.guardianName as string).trim(),
      guardianPhone: (input.guardianPhone as string).trim(),
    },
  };
}

function databaseUnavailable(reply: FastifyReply) {
  return reply.code(503).send({ error: "Database unavailable" });
}

export function buildServer(): FastifyInstance {
  const app = Fastify({ logger: true });

  app.post<{ Body: unknown }>("/pupils", async (request, reply) => {
    const validation = validateBody(request.body);
    if (!validation.ok) {
      return reply.code(400).send({ error: validation.message });
    }

    const { pupilName, pupilClass, guardianName, guardianPhone } = validation.values;

    try {
      const guardianRows = (await sql`
        INSERT INTO guardians (name, phone)
        VALUES (${guardianName}, ${guardianPhone})
        RETURNING id, name, phone
      `) as GuardianRecord[];

      const guardian = guardianRows[0];
      if (!guardian) {
        return databaseUnavailable(reply);
      }

      const pupilRows = (await sql`
        INSERT INTO pupils (name, "class", guardian_id)
        VALUES (${pupilName}, ${pupilClass}, ${guardian.id})
        RETURNING id, name, "class", guardian_id
      `) as PupilRecord[];

      const pupil = pupilRows[0];
      if (!pupil) {
        return databaseUnavailable(reply);
      }

      return reply.code(201).send({ pupil, guardian });
    } catch (error) {
      request.log.error({ err: error }, "Failed to create pupil");
      return databaseUnavailable(reply);
    }
  });

  return app;
}

const app = buildServer();

const isMain =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const port = Number(process.env.PORT ?? 3000);
  app
    .listen({ port, host: "0.0.0.0" })
    .catch((error) => {
      app.log.error(error);
      process.exit(1);
    });
}
