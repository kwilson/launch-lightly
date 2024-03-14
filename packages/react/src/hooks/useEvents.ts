import { useEffect } from "react";
import { ZodObject, ZodRawShape, z } from "zod";

type UseEventsArgs<TSchema extends ZodRawShape> = {
  url: string;
  schema: ZodObject<TSchema>;
  onMessage: (message: z.infer<ZodObject<TSchema>>) => void;
};

export function useEvents<TSchema extends ZodRawShape>({
  url,
  schema,
  onMessage,
}: UseEventsArgs<TSchema>) {
  useEffect(() => {
    const sse = new EventSource(url);

    const onMessageEvent = (ev: MessageEvent) => {
      const parsed = schema.safeParse(JSON.parse(ev.data));
      if (parsed.success) {
        onMessage(parsed.data);
      }
    };

    const onError = (ev: MessageEvent) => {
      console.error(ev);
    };

    sse.addEventListener("message", onMessageEvent);
    sse.addEventListener("error", onError);

    return () => {
      sse.removeEventListener("message", onMessageEvent);
      sse.removeEventListener("error", onError);
      sse.close();
    };
  }, []);
}
