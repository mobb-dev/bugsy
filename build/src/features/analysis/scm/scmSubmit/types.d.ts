import { z } from 'zod';
export declare const submitToScmMessageType: {
    readonly commitToSameBranch: "commitToSameBranch";
    readonly submitFixesForDifferentBranch: "submitFixesForDifferentBranch";
};
export declare const CommitToSameBranchParamsZ: z.ZodObject<z.objectUtil.extendShape<{
    submitFixRequestId: z.ZodString;
    fixes: z.ZodArray<z.ZodObject<{
        fixId: z.ZodString;
        diff: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        diff: string;
        fixId: string;
    }, {
        diff: string;
        fixId: string;
    }>, "many">;
    commitHash: z.ZodString;
    repoUrl: z.ZodString;
}, {
    type: z.ZodLiteral<"commitToSameBranch">;
    branch: z.ZodString;
    commitMessage: z.ZodString;
    commitDescription: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    githubCommentId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}>, "strip", z.ZodTypeAny, {
    type: "commitToSameBranch";
    branch: string;
    repoUrl: string;
    submitFixRequestId: string;
    fixes: {
        diff: string;
        fixId: string;
    }[];
    commitHash: string;
    commitMessage: string;
    commitDescription?: string | null | undefined;
    githubCommentId?: number | null | undefined;
}, {
    type: "commitToSameBranch";
    branch: string;
    repoUrl: string;
    submitFixRequestId: string;
    fixes: {
        diff: string;
        fixId: string;
    }[];
    commitHash: string;
    commitMessage: string;
    commitDescription?: string | null | undefined;
    githubCommentId?: number | null | undefined;
}>;
export declare const SubmitFixesToDifferentBranchParamsZ: z.ZodObject<z.objectUtil.extendShape<{
    type: z.ZodLiteral<"submitFixesForDifferentBranch">;
    submitBranch: z.ZodString;
    baseBranch: z.ZodString;
}, {
    submitFixRequestId: z.ZodString;
    fixes: z.ZodArray<z.ZodObject<{
        fixId: z.ZodString;
        diff: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        diff: string;
        fixId: string;
    }, {
        diff: string;
        fixId: string;
    }>, "many">;
    commitHash: z.ZodString;
    repoUrl: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    type: "submitFixesForDifferentBranch";
    repoUrl: string;
    submitFixRequestId: string;
    fixes: {
        diff: string;
        fixId: string;
    }[];
    commitHash: string;
    submitBranch: string;
    baseBranch: string;
}, {
    type: "submitFixesForDifferentBranch";
    repoUrl: string;
    submitFixRequestId: string;
    fixes: {
        diff: string;
        fixId: string;
    }[];
    commitHash: string;
    submitBranch: string;
    baseBranch: string;
}>;
export declare const SubmitFixesMessageZ: z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
    submitFixRequestId: z.ZodString;
    fixes: z.ZodArray<z.ZodObject<{
        fixId: z.ZodString;
        diff: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        diff: string;
        fixId: string;
    }, {
        diff: string;
        fixId: string;
    }>, "many">;
    commitHash: z.ZodString;
    repoUrl: z.ZodString;
}, {
    type: z.ZodLiteral<"commitToSameBranch">;
    branch: z.ZodString;
    commitMessage: z.ZodString;
    commitDescription: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    githubCommentId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}>, "strip", z.ZodTypeAny, {
    type: "commitToSameBranch";
    branch: string;
    repoUrl: string;
    submitFixRequestId: string;
    fixes: {
        diff: string;
        fixId: string;
    }[];
    commitHash: string;
    commitMessage: string;
    commitDescription?: string | null | undefined;
    githubCommentId?: number | null | undefined;
}, {
    type: "commitToSameBranch";
    branch: string;
    repoUrl: string;
    submitFixRequestId: string;
    fixes: {
        diff: string;
        fixId: string;
    }[];
    commitHash: string;
    commitMessage: string;
    commitDescription?: string | null | undefined;
    githubCommentId?: number | null | undefined;
}>, z.ZodObject<z.objectUtil.extendShape<{
    type: z.ZodLiteral<"submitFixesForDifferentBranch">;
    submitBranch: z.ZodString;
    baseBranch: z.ZodString;
}, {
    submitFixRequestId: z.ZodString;
    fixes: z.ZodArray<z.ZodObject<{
        fixId: z.ZodString;
        diff: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        diff: string;
        fixId: string;
    }, {
        diff: string;
        fixId: string;
    }>, "many">;
    commitHash: z.ZodString;
    repoUrl: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    type: "submitFixesForDifferentBranch";
    repoUrl: string;
    submitFixRequestId: string;
    fixes: {
        diff: string;
        fixId: string;
    }[];
    commitHash: string;
    submitBranch: string;
    baseBranch: string;
}, {
    type: "submitFixesForDifferentBranch";
    repoUrl: string;
    submitFixRequestId: string;
    fixes: {
        diff: string;
        fixId: string;
    }[];
    commitHash: string;
    submitBranch: string;
    baseBranch: string;
}>]>;
export type SubmitFixesMessage = z.infer<typeof SubmitFixesMessageZ>;
export type CommitToSameBranchParams = z.infer<typeof CommitToSameBranchParamsZ>;
export type SubmitFixesToDifferentBranchParams = z.infer<typeof SubmitFixesToDifferentBranchParamsZ>;
declare const FixResponseArrayZ: z.ZodArray<z.ZodObject<{
    fixId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    fixId: string;
}, {
    fixId: string;
}>, "many">;
export type FixResponseArray = z.infer<typeof FixResponseArrayZ>;
export declare const SubmitFixesBaseResponseMessageZ: z.ZodObject<{
    submitFixRequestId: z.ZodString;
    submitBranches: z.ZodArray<z.ZodObject<{
        branchName: z.ZodString;
        fixes: z.ZodArray<z.ZodObject<{
            fixId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            fixId: string;
        }, {
            fixId: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }, {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }>, "many">;
    error: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<["InitialRepoAccessError", "PushBranchError", "UnknownError"]>;
        info: z.ZodObject<{
            message: z.ZodString;
            pushBranchName: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            message: string;
            pushBranchName?: string | undefined;
        }, {
            message: string;
            pushBranchName?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    }, {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    }>>;
}, "strip", z.ZodTypeAny, {
    submitFixRequestId: string;
    submitBranches: {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }[];
    error?: {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    } | undefined;
}, {
    submitFixRequestId: string;
    submitBranches: {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }[];
    error?: {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    } | undefined;
}>;
export declare const SubmitFixesToSameBranchResponseMessageZ: z.ZodObject<z.objectUtil.extendShape<{
    type: z.ZodLiteral<"commitToSameBranch">;
    githubCommentId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, {
    submitFixRequestId: z.ZodString;
    submitBranches: z.ZodArray<z.ZodObject<{
        branchName: z.ZodString;
        fixes: z.ZodArray<z.ZodObject<{
            fixId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            fixId: string;
        }, {
            fixId: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }, {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }>, "many">;
    error: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<["InitialRepoAccessError", "PushBranchError", "UnknownError"]>;
        info: z.ZodObject<{
            message: z.ZodString;
            pushBranchName: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            message: string;
            pushBranchName?: string | undefined;
        }, {
            message: string;
            pushBranchName?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    }, {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    }>>;
}>, "strip", z.ZodTypeAny, {
    type: "commitToSameBranch";
    submitFixRequestId: string;
    submitBranches: {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }[];
    githubCommentId?: number | null | undefined;
    error?: {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    } | undefined;
}, {
    type: "commitToSameBranch";
    submitFixRequestId: string;
    submitBranches: {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }[];
    githubCommentId?: number | null | undefined;
    error?: {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    } | undefined;
}>;
export type SubmitFixesToSameBranchResponseMessage = z.infer<typeof SubmitFixesToSameBranchResponseMessageZ>;
export declare const SubmitFixesToDifferentBranchResponseMessageZ: z.ZodObject<z.objectUtil.extendShape<{
    type: z.ZodLiteral<"submitFixesForDifferentBranch">;
    githubCommentId: z.ZodOptional<z.ZodNumber>;
}, {
    submitFixRequestId: z.ZodString;
    submitBranches: z.ZodArray<z.ZodObject<{
        branchName: z.ZodString;
        fixes: z.ZodArray<z.ZodObject<{
            fixId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            fixId: string;
        }, {
            fixId: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }, {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }>, "many">;
    error: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<["InitialRepoAccessError", "PushBranchError", "UnknownError"]>;
        info: z.ZodObject<{
            message: z.ZodString;
            pushBranchName: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            message: string;
            pushBranchName?: string | undefined;
        }, {
            message: string;
            pushBranchName?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    }, {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    }>>;
}>, "strip", z.ZodTypeAny, {
    type: "submitFixesForDifferentBranch";
    submitFixRequestId: string;
    submitBranches: {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }[];
    githubCommentId?: number | undefined;
    error?: {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    } | undefined;
}, {
    type: "submitFixesForDifferentBranch";
    submitFixRequestId: string;
    submitBranches: {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }[];
    githubCommentId?: number | undefined;
    error?: {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    } | undefined;
}>;
export type SubmitFixesToDifferentBranchResponseMessage = z.infer<typeof SubmitFixesToDifferentBranchResponseMessageZ>;
export declare const SubmitFixesResponseMessageZ: z.ZodDiscriminatedUnion<"type", [z.ZodObject<z.objectUtil.extendShape<{
    type: z.ZodLiteral<"commitToSameBranch">;
    githubCommentId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, {
    submitFixRequestId: z.ZodString;
    submitBranches: z.ZodArray<z.ZodObject<{
        branchName: z.ZodString;
        fixes: z.ZodArray<z.ZodObject<{
            fixId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            fixId: string;
        }, {
            fixId: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }, {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }>, "many">;
    error: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<["InitialRepoAccessError", "PushBranchError", "UnknownError"]>;
        info: z.ZodObject<{
            message: z.ZodString;
            pushBranchName: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            message: string;
            pushBranchName?: string | undefined;
        }, {
            message: string;
            pushBranchName?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    }, {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    }>>;
}>, "strip", z.ZodTypeAny, {
    type: "commitToSameBranch";
    submitFixRequestId: string;
    submitBranches: {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }[];
    githubCommentId?: number | null | undefined;
    error?: {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    } | undefined;
}, {
    type: "commitToSameBranch";
    submitFixRequestId: string;
    submitBranches: {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }[];
    githubCommentId?: number | null | undefined;
    error?: {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    } | undefined;
}>, z.ZodObject<z.objectUtil.extendShape<{
    type: z.ZodLiteral<"submitFixesForDifferentBranch">;
    githubCommentId: z.ZodOptional<z.ZodNumber>;
}, {
    submitFixRequestId: z.ZodString;
    submitBranches: z.ZodArray<z.ZodObject<{
        branchName: z.ZodString;
        fixes: z.ZodArray<z.ZodObject<{
            fixId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            fixId: string;
        }, {
            fixId: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }, {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }>, "many">;
    error: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<["InitialRepoAccessError", "PushBranchError", "UnknownError"]>;
        info: z.ZodObject<{
            message: z.ZodString;
            pushBranchName: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            message: string;
            pushBranchName?: string | undefined;
        }, {
            message: string;
            pushBranchName?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    }, {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    }>>;
}>, "strip", z.ZodTypeAny, {
    type: "submitFixesForDifferentBranch";
    submitFixRequestId: string;
    submitBranches: {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }[];
    githubCommentId?: number | undefined;
    error?: {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    } | undefined;
}, {
    type: "submitFixesForDifferentBranch";
    submitFixRequestId: string;
    submitBranches: {
        fixes: {
            fixId: string;
        }[];
        branchName: string;
    }[];
    githubCommentId?: number | undefined;
    error?: {
        type: "InitialRepoAccessError" | "PushBranchError" | "UnknownError";
        info: {
            message: string;
            pushBranchName?: string | undefined;
        };
    } | undefined;
}>]>;
export type SubmitFixesResponseMessage = z.infer<typeof SubmitFixesResponseMessageZ>;
export {};
//# sourceMappingURL=types.d.ts.map