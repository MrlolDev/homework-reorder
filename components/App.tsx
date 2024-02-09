import { kv } from "@vercel/kv";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { CheckCheckIcon } from "lucide-react";
import { useToast } from "./ui/use-toast";
import confetti from "canvas-confetti";

const students = [
  {
    name: "Leo",
    completed: 0,
  },
  {
    name: "Postigo",
    completed: 0,
  },
  {
    name: "Antonio",
    completed: 0,
  },
  {
    name: "Gonzalo",
    completed: 0,
  },
  {
    name: "Manuel",
    completed: 0,
  },
  {
    name: "Rubén",
    completed: 0,
  },
  {
    name: "Juanma",
    completed: 0,
  },
  {
    name: "Paula",
    completed: 0,
  },
];

export default function App() {
  const [studentsOrder, setStudentsOrder] = useState(students);
  const [defaultOrder, setDefaultOrder] = useState<boolean | "loading">(
    "loading"
  );
  const { toast } = useToast();

  function getWeekOfMonth(date: Date): number {
    const firstDayOfMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay();
    const dayOfMonth = date.getDate();
    return Math.ceil((dayOfMonth + firstDayOfMonth) / 7);
  }
  async function getWeeksOrder() {
    if (defaultOrder != "loading") return;
    const month = new Date().getMonth() + 1;
    const weekNumber = getWeekOfMonth(new Date());
    const order: any = await kv.get(`${month}-${weekNumber}`);
    if (order) {
      setStudentsOrder(order);
      setDefaultOrder(false);
    } else {
      setDefaultOrder(true);
    }
  }
  const makeConfetti = () => {
    confetti({
      zIndex: 9999,
      particleCount: 500,
      spread: 200,
      origin: { y: 0.6 }, // Adjust to ensure confetti comes from different origins
    });
  };
  getWeeksOrder();

  return (
    <Card className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] min-w-[20vw]">
      <CardHeader>
        <CardTitle>Ordén de la semana </CardTitle>
      </CardHeader>
      <CardContent>
        {defaultOrder === "loading" ? (
          <p>Cargando...</p>
        ) : (
          <>
            <div className="flex flex-row justify-between mb-2">
              <p className="text-sm">Semana: {getWeekOfMonth(new Date())}</p>
              <p className="text-sm">Mes: {new Date().getMonth() + 1}</p>
            </div>
            {defaultOrder ? (
              <>
                <p>No se ha establecido un orden para esta semana</p>
              </>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Nombre</TableHead>
                      <TableHead className="text-center">
                        Tareas Completadas
                      </TableHead>
                      <TableHead className="text-right">Completar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsOrder.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          {student.completed}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            onClick={async () => {
                              // add one to the completed tasks and put the student at the end of the list
                              student.completed += 1;
                              const newOrder = studentsOrder.filter(
                                (s) => s.name !== student.name
                              );
                              newOrder.push(student);
                              setStudentsOrder(newOrder);
                              await kv.set(
                                `${new Date().getMonth() + 1}-${getWeekOfMonth(
                                  new Date()
                                )}`,
                                JSON.stringify(newOrder)
                              );
                              setDefaultOrder(false);
                              toast({
                                title: "Éxito",
                                description: "Se ha completado la tarea",
                                duration: 5000,
                              });
                            }}
                          >
                            <CheckCheckIcon size={24} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}

            <div className="flex flex-row justify-between mt-4 gap-4">
              <Button
                onClick={async () => {
                  if (!defaultOrder) {
                    toast({
                      title: "Error",
                      description:
                        "La lista ya está ordenada para esta semana.",
                      variant: "destructive",
                      duration: 5000,
                    });
                  }
                  const newOrder = studentsOrder
                    .sort(() => Math.random() - 0.5)
                    .map((student) => {
                      student.completed = 0;
                      return student;
                    });
                  setStudentsOrder(newOrder);
                  await kv.set(
                    `${new Date().getMonth() + 1}-${getWeekOfMonth(
                      new Date()
                    )}`,
                    JSON.stringify(studentsOrder)
                  );
                  setDefaultOrder(false);
                  makeConfetti();
                  toast({
                    title: "Éxito",
                    description: "Se ha reordenado la lista",
                    duration: 5000,
                  });
                }}
                className="w-full"
                disabled={defaultOrder ? false : true}
              >
                Reordenar
              </Button>
              <Button
                disabled={defaultOrder}
                onClick={async () => {
                  setDefaultOrder(true);
                  await kv.del(
                    `${new Date().getMonth() + 1}-${getWeekOfMonth(new Date())}`
                  );
                  toast({
                    title: "Éxito",
                    description: "Se ha eliminado el orden",
                    duration: 5000,
                  });
                }}
                className="w-full"
                variant={"destructive"}
              >
                Eliminar
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
