export const DEFAULT_COURSES = [
  {
    _id: "c1",
    title: "Production Distributed Systems with Go & gRPC",
    description: "Architect, build, and deploy fault-tolerant distributed microservices. Covers Raft consensus, distributed locking, observability with OpenTelemetry, and zero-downtime rolling deploys.",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    price: 4999,
    category: "Backend & Systems",
    level: "Advanced",
    duration: "28 hours",
    lessonsCount: 42,
    rating: 4.9,
    reviewsCount: 382,
    instructor: {
      name: "Arjun Verma",
      role: "Principal Systems Engineer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    modules: [
      { title: "Foundations of Consensus & CAP Theorem", duration: "4.5 hrs", lessons: 6 },
      { title: "Building Raft in Go from Scratch", duration: "8.0 hrs", lessons: 12 },
      { title: "High-Throughput gRPC & Protobuf Schemas", duration: "5.5 hrs", lessons: 8 },
      { title: "Distributed Tracing & Production Deployment", duration: "10.0 hrs", lessons: 16 }
    ]
  },
  {
    _id: "c2",
    title: "Fullstack Architecture: Next.js 15, Node & PostgreSQL",
    description: "From database modeling to server actions and edge caching. Build a scalable SaaS platform with raw SQL query tuning, Prisma, Redis rate-limiting, and Stripe webhook handling.",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    price: 3499,
    category: "Fullstack",
    level: "Intermediate",
    duration: "32 hours",
    lessonsCount: 54,
    rating: 4.85,
    reviewsCount: 620,
    instructor: {
      name: "Priya Nair",
      role: "Staff Fullstack Architect",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
    },
    modules: [
      { title: "Relational Modeling & Schema Optimization", duration: "6.0 hrs", lessons: 10 },
      { title: "Next.js App Router, SSR & Streaming", duration: "9.0 hrs", lessons: 15 },
      { title: "Authentication, RBAC & Session Security", duration: "7.0 hrs", lessons: 11 },
      { title: "Webhooks, Payments & Multi-Tenant SaaS", duration: "10.0 hrs", lessons: 18 }
    ]
  },
  {
    _id: "c3",
    title: "Kubernetes & Cloud Infrastructure for Backend Engineers",
    description: "Master container orchestration, Helm charts, ingress controllers, CI/CD pipelines on AWS EKS, and Terraform infrastructure-as-code for resilient cloud setups.",
    imageUrl: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80",
    price: 4299,
    category: "Cloud & DevOps",
    level: "Intermediate to Advanced",
    duration: "24 hours",
    lessonsCount: 36,
    rating: 4.92,
    reviewsCount: 290,
    instructor: {
      name: "Marcus Vance",
      role: "Lead DevOps Architect",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    modules: [
      { title: "Containers & Docker Layer Caching Mastery", duration: "4.0 hrs", lessons: 7 },
      { title: "K8s Architecture, Pods, Services & ConfigMaps", duration: "8.0 hrs", lessons: 12 },
      { title: "Terraform Modules for Cloud Infrastructure", duration: "6.0 hrs", lessons: 9 },
      { title: "Zero-Downtime CD Pipelines & Monitoring", duration: "6.0 hrs", lessons: 8 }
    ]
  },
  {
    _id: "c4",
    title: "Rust for High-Performance Backend Microservices",
    description: "Unlock memory safety and blinding speed. Build async microservices using Tokio, Axum, SQLx, and write custom low-level network protocols without garbage collection pauses.",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
    price: 5499,
    category: "Backend & Systems",
    level: "Advanced",
    duration: "30 hours",
    lessonsCount: 48,
    rating: 4.96,
    reviewsCount: 185,
    instructor: {
      name: "Devon Chen",
      role: "Rust Core Contributor & Consultant",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    modules: [
      { title: "Borrow Checker, Lifetimes & Zero-Cost Abstractions", duration: "7.0 hrs", lessons: 10 },
      { title: "Async Runtimes with Tokio & Concurrency", duration: "8.0 hrs", lessons: 12 },
      { title: "Axum Web Framework & Type-Safe Handlers", duration: "6.5 hrs", lessons: 11 },
      { title: "Benchmarking, Profiling & Memory Footprint Tuning", duration: "8.5 hrs", lessons: 15 }
    ]
  },
  {
    _id: "c5",
    title: "Modern Database Internals: Indexes, LSM-Trees & WAL",
    description: "Deep dive into how databases actually work under the hood. Implement a B+Tree, write-ahead logging (WAL), concurrency control (MVCC), and buffer pool management in code.",
    imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
    price: 3899,
    category: "Backend & Systems",
    level: "Advanced",
    duration: "22 hours",
    lessonsCount: 34,
    rating: 4.88,
    reviewsCount: 145,
    instructor: {
      name: "Siddharth Roy",
      role: "Database Engine Developer",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
    },
    modules: [
      { title: "Disk I/O, Pages & Buffer Cache Management", duration: "4.5 hrs", lessons: 6 },
      { title: "Implementing B+ Tree Indexing", duration: "7.0 hrs", lessons: 10 },
      { title: "LSM Trees, SSTables & Compaction", duration: "5.5 hrs", lessons: 8 },
      { title: "Write-Ahead Logging (WAL) & Crash Recovery", duration: "5.0 hrs", lessons: 10 }
    ]
  },
  {
    _id: "c6",
    title: "Production LLM Engineering & Vector Architectures",
    description: "Go beyond toy prompts. Build enterprise RAG pipelines with semantic routing, hybrid search (BM25 + Dense Vectors), evaluation harnesses, and real-time streaming agents.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    price: 4599,
    category: "AI Engineering",
    level: "Intermediate",
    duration: "26 hours",
    lessonsCount: 38,
    rating: 4.93,
    reviewsCount: 410,
    instructor: {
      name: "Elena Rostova",
      role: "AI Infrastructure Lead",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    },
    modules: [
      { title: "Embeddings, Chunking Strategies & Vector Spaces", duration: "5.0 hrs", lessons: 7 },
      { title: "Building Scalable Hybrid RAG with Qdrant", duration: "7.5 hrs", lessons: 11 },
      { title: "Agentic Tool Calling & Structured Outputs", duration: "6.5 hrs", lessons: 9 },
      { title: "Latency Reduction, Caching & Token Optimization", duration: "7.0 hrs", lessons: 11 }
    ]
  }
];
