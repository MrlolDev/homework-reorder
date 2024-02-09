import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { kv } from "@vercel/kv";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

export default function Auth({
  setAuth,
}: {
  setAuth: (auth: boolean) => void;
}) {
  const { toast } = useToast();

  async function submit() {
    const password = await kv.get("password");
    const value = document.getElementById("password") as HTMLInputElement;
    if (!password) {
      kv.set("password", "973379");
    }
    if (value.value === "") {
      toast({
        title: "Error",
        description: "La contraseña no puede estar vacía",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    if (value.value == password) {
      setAuth(true);
      toast({
        title: "Éxito",
        description: "Ha iniciado sesión",
        duration: 5000,
      });
    } else {
      toast({
        title: "Error",
        description: "La contraseña es incorrecta",
        variant: "destructive",
        duration: 5000,
      });
    }
  }
  return (
    <Card className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] min-w-[20vw]">
      <CardHeader>
        <CardTitle>Iniciar</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="password"
          placeholder="Contraseña"
          id="password"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submit();
            }
          }}
        />
        <Button
          className="mt-4 w-full"
          onClick={async () => {
            submit();
          }}
        >
          Entrar
        </Button>
      </CardContent>
    </Card>
  );
}
