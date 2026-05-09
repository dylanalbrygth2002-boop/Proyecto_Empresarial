import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: {
          select: { name: true, company: true, email: true },
        },
        tasks: {
          orderBy: { createdAt: "asc" },
          include: {
            responsible: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!project) {
      return new Response("Proyecto no encontrado", { status: 404 });
    }

    const doc = new jsPDF();

    // Titulo
    doc.setFontSize(20);
    doc.text("TechSolutions S.A.", 14, 20);
    doc.setFontSize(16);
    doc.text("Reporte de Proyecto", 14, 30);

    // Linea separadora
    doc.setDrawColor(0, 0, 255);
    doc.setLineWidth(0.5);
    doc.line(14, 34, 196, 34);

    // Informacion del proyecto
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Información del Proyecto", 14, 44);
    doc.setFont("helvetica", "normal");

    const infoData = [
      ["Nombre del Proyecto:", project.name],
      ["Cliente:", `${project.client.name} (${project.client.company})`],
      ["Correo del Cliente:", project.client.email],
      ["Estado:", formatStatus(project.status)],
      ["Fecha de Inicio:", formatDate(project.startDate)],
      ["Fecha de Fin:", project.endDate ? formatDate(project.endDate) : "No definida"],
      ["Descripción:", project.description || "Sin descripción"],
    ];

    autoTable(doc, {
      startY: 48,
      body: infoData,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 50 },
        1: { cellWidth: "auto" },
      },
    });

    // Tareas
    const finalY = (doc as any).lastAutoTable.finalY || 80;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Tareas del Proyecto", 14, finalY + 10);
    doc.setFont("helvetica", "normal");

    if (project.tasks.length === 0) {
      doc.setFontSize(10);
      doc.text("No hay tareas registradas para este proyecto.", 14, finalY + 18);
    } else {
      const taskData = project.tasks.map((task) => [
        task.title,
        task.responsible.name,
        formatPriority(task.priority),
        formatStatus(task.status),
        task.createdAt ? formatDateTime(task.createdAt) : "-",
        task.updatedAt && task.status === "COMPLETED" ? formatDateTime(task.updatedAt) : "-",
      ]);

      autoTable(doc, {
        startY: finalY + 14,
        head: [["Tarea", "Responsable", "Prioridad", "Estado", "Fecha Inicio", "Fecha Fin"]],
        body: taskData,
        theme: "striped",
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
        styles: { fontSize: 9, cellPadding: 3 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Generado el ${new Date().toLocaleString("es-ES")} - Página ${i} de ${pageCount}`,
        14,
        doc.internal.pageSize.height - 10
      );
      doc.text("TechSolutions S.A. - Sistema Empresarial", doc.internal.pageSize.width - 80, doc.internal.pageSize.height - 10);
    }

    const pdfBuffer = doc.output("arraybuffer");

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="reporte-proyecto-${project.name.replace(/\s+/g, "-").toLowerCase()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generando reporte:", error);
    return new Response("Error al generar el reporte", { status: 500 });
  }
}

function formatStatus(status: string): string {
  const map: Record<string, string> = {
    PLANNED: "Planificado",
    IN_PROGRESS: "En Progreso",
    PAUSED: "Pausado",
    FINISHED: "Finalizado",
    CANCELLED: "Cancelado",
    PENDING: "Pendiente",
    IN_REVIEW: "En Revisión",
    COMPLETED: "Completada",
  };
  return map[status] || status;
}

function formatPriority(priority: string): string {
  const map: Record<string, string> = {
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta",
    CRITICAL: "Crítica",
  };
  return map[priority] || priority;
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
