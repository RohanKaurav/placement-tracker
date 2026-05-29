import { prisma } from "../db/prisma"; 

export interface QuestionWithProgress {
    id: string;
    title: string;
    url: string;
    difficulty: "EASY" | "MEDIUM" | "HARD" | string;
    points: number;
    isSolved: boolean;
    isStarred: boolean;
    notes: string | null;
    solvedAt: Date | null;
}

export async function getAllQuestionsForUser(userId:string):Promise<QuestionWithProgress[]>{
    const questions = await prisma.question.findMany({
        orderBy:[
            {difficulty: 'asc'},
            {title: 'asc'}
        ]
    }) 
    const UserProgress = await prisma.userProgress.findMany({
        where:{userId}
    })  

    const ProgressMapofUser = new Map(UserProgress.map((p)=>[p.questionId,p]))

    const mappedQuestions: QuestionWithProgress[] = questions.map((q) => {
        const progress = ProgressMapofUser.get(q.id);
        return {
          id: q.id,
          title: q.title,
          url: q.url,
          difficulty: q.difficulty,
          points: q.points,
          isSolved: progress?.isSolved ?? false,
          isStarred: progress?.isStarred ?? false,
          notes: progress?.notes ?? null,
          solvedAt: progress?.solvedAt ?? null,
        };
      });
    
      const difficultyOrder = { EASY: 1, MEDIUM: 2, HARD: 3 };
      return mappedQuestions.sort((a, b) => {
        const orderA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 4;
        const orderB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 4;
        if (orderA !== orderB) return orderA - orderB;
        return a.title.localeCompare(b.title);
      });
}
      export async function toggleQuestionSolved(userId:string, questionId:string):Promise<QuestionWithProgress>{
        const question = await prisma.question.findUnique({
            where:{id:questionId}
        })
        console.log("Toggling solve status for userId:", userId, "questionId:", questionId)

        if(!question){
            throw new Error("Question not found")
       }
       return prisma.$transaction(async (tx) =>{
            const existingProgress =await tx.userProgress.findUnique({
                where:{
                    userId_questionId:{
                        userId,
                        questionId
                    },
                }
            })

            const isCurrentlySolved = existingProgress?.isSolved ?? false;
            const nextSolvedState = !isCurrentlySolved;
            const pointsDelta = nextSolvedState ? question.points : -question.points;
            const solvedCountDelta = nextSolvedState ? 1 : -1;

            const updatedProgress = await tx.userProgress.upsert({
                where:{
                    userId_questionId:{
                        userId,
                        questionId
                    }
                },
                update:{
                    isSolved: nextSolvedState,
                    solvedAt: nextSolvedState ? new Date() : null,
                },
                create:{
                    userId,
                    questionId,
                    isSolved: nextSolvedState,  
                    solvedAt: nextSolvedState ? new Date() : null,
                }
            })

            await tx.user.update({
                where:{id:userId},
                data:{
                    totalPoints: {  
                        increment: pointsDelta
                    },
                    solvedCount:{
                        increment: solvedCountDelta
                    }
                }
            })
            return {
                id: question.id,
                title: question.title,
                url: question.url,
                difficulty: question.difficulty,
                points: question.points,
                isSolved: updatedProgress.isSolved,
                isStarred: updatedProgress.isStarred,
                notes: updatedProgress.notes,
                solvedAt: updatedProgress.solvedAt,
              };
       })
}

export async function toggleQuestionStarredOne(userId:string,questionId:string):Promise<QuestionWithProgress>{
    const question = await prisma.question.findUnique({
        where: {id:questionId}
        
    })
    if(!question){
        throw new Error("Question not found")
    }
    const existingProgress = await prisma.userProgress.findUnique({
        where: {
          userId_questionId: { userId, questionId },
        },
      });

      const nextStarredState = !(existingProgress?.isStarred ?? false)
      const updatedProgress = await prisma.userProgress.upsert({
        where:{
            userId_questionId:{userId, questionId}
        },
        update:{
            isStarred: nextStarredState
        },
        create:{
            userId,
            questionId,
            isStarred: nextStarredState,
        }
      })
      return {
        id: question.id,
        title: question.title,
        url: question.url,
        difficulty: question.difficulty,
        points: question.points,
        isSolved: updatedProgress.isSolved,
        isStarred: updatedProgress.isStarred,
        notes: updatedProgress.notes,
        solvedAt: updatedProgress.solvedAt,
      };
}

export async function updateNotesForQuestion(userId:string, questionId:string, notes:string):Promise<QuestionWithProgress>{
    const question = await prisma.question.findUnique({
        where:{id:questionId}
    })
    if(!question){
        throw new Error("Question not found")
    }

    const updatedProgress = await prisma.userProgress.upsert({
        where:{
            userId_questionId:{
                userId,
                questionId
            },
        },
            update:{
                notes,
            },
            create:{
                userId,
                questionId,
                notes,  
            }
        
    });
    return{
        id: question.id,
        title: question.title,
        url: question.url,
        difficulty: question.difficulty,
        points: question.points,
        isSolved: updatedProgress.isSolved,
        isStarred: updatedProgress.isStarred,
        notes: updatedProgress.notes,
        solvedAt: updatedProgress.solvedAt,
  }
}

