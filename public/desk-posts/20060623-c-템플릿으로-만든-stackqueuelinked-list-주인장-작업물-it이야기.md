---
date: "2006-06-23"
titleKo: "[C++] 템플릿으로 만든 Stack/Queue/Linked List 주인장 작업물 / IT이야기"
titleEn: "[C++] Stack/Queue/Linked List Made with Templates"
category: it
tags:
  - 주인장 작업물
images: []
sourceCategoryNo: "16"
sourceCategory: 주인장 작업물
externalUrl: https://blog.naver.com/fstory97/70005412705
---

<!-- ko -->
/* C++로 만든 Stack / Queue/ Linked List 본 자료는 VC++ 6.0에서 테스트를 했습니다. template으로 구현되있으며 class를 스택,큐,링크드 리스트로 관리할수 있습니다. 실제로 stack, queue, linkedlist 각각 헤더파일로 만들어서 사용하십시오
2003년에 제작 */
#ifndef __STACK_H
#define __STACK_H
#define STACK_EMPTY -1
/* 이 Stack을 사용하기 위해서는 class Type이  operator =  을 지원해야 합니다.  */
template <class Type>
class Stack;
template <class Type>
class Stack{
private :
int capacity;   // Data Capacity
int top;          // Top Counter
Type *data;               // Data Pointer
public :
Stack();
Stack(int capacity);
virtual ~Stack();
void Reset();
void Push(Type &data);
Type Pop();
Type Top();
void Capacity(int capacity);
int Capacity();
bool Empty();
bool Full();
};

template <class Type>
Stack<Type>::Stack()
this->capacity=0;
this->top=STACK_EMPTY;
this->data=NULL;
template <class Type>
Stack<Type>::Stack(int cap)
this->capacity=cap;
this->top=STACK_EMPTY;
this->data=new Type[cap];
template <class Type>
Stack<Type>::~Stack()
if ((this->data)!=NULL)
delete []this->data;
template <class Type>
void Stack<Type>::Reset()
this->top=STACK_EMPTY;
template <class Type>
void Stack<Type>::Push(Type &input)
this->top++;
this->data[this->top]=input;
template <class Type>
Type Stack<Type>::Pop()
Type returnData;
returnData=this->data[this->top];
this->top--;
return returnData;
template <class Type>
Type Stack<Type>::Top()
Type returnData;
returnData=this->data[this->top];
return returnData;
template <class Type>
void Stack<Type>::Capacity(int cap)
if (this-data==NULL)
this->data=new Type[cap];
template <class Type>
int Stack<Type>::Capacity()
return this->capacity;
template <class Type>
bool Stack<Type>::Empty()
return ((this->top)==STACK_EMPTY);
template <class Type>
bool Stack<Type>::Full()
return ((this->top)==(this->capacity-1));

#endif  __STACK_H

#ifndef __QUEUE_H
#define __QUEUE_H
#define QUEUE_EMPTY 0
#include <stdlib.h>
/* 이 Queue를 사용하기 위해서는 class Type이  operator =  을 지원해야 합니다.  */
template <class Type>
class Queue;
template <class Type>
class Queue{
private :
template <class Type>
class Node{
public:
Type data;
Node<Type> *next;

void operator=(const Node &source)
data=source.data;
};

private :
int count;
Node<Type> *first;
Node<Type> *rear;

public :
Queue();
virtual ~Queue();
void EnQueue(Type &source);
Type DeQueue();
Type Recent();
Type Last();
Type Lookup();
int Count();
bool Empty();

};
template <class Type>
Queue<Type>::Queue()
count=0;
first=NULL;
rear=NULL;
template <class Type>
Queue<Type>::~Queue()
if (first!=NULL)
while(!Empty())    DeQueue();
template<class Type>
void Queue<Type>::EnQueue(Type &source)
Node<Type> *storage;

storage = new Node<Type>;  // Storage Create
storage->data=source;      // data copy
storage->next=NULL;
/* Node Link  */
if (Empty())
first=storage;
rear=storage;
else
rear->next=storage;
rear=storage;
count++;
template<class Type>
Type Queue<Type>::DeQueue()
Type returnData;   // Data for Return
Node<Type> *freeNode;
returnData=first->data;    // Data Copy
freeNode=first;   // fist Pointer Backup for Delete
first=first->next;   // first Pointer Moving
count--;

delete freeNode;  // free old Node
return returnData;   // return
template<class Type>
Type Queue<Type>::Recent()
{       return rear->data;       }

template<class Type>
Type Queue<Type>::Last()
return first->data;

template<class Type>
int Queue<Type>::Count()
return count;
template<class Type>
bool Queue<Type>::Empty()
return (count==QUEUE_EMPTY);
#endif  __QUEUE_H
#ifndef __LINKEDLIST_H
#define __LINKEDLIST_H
#define LINK_EMPTY 0
/* 이 List를 사용하기 위해서는 class Type이
1) operator =    2) operator ==    3) Compare함수를 지원해야 합니다. */
template <class Type>
class List;
template <class Type>
class List{
private :
typedef enum POINTER {FIRST_POINTER, SECOND_POINTER} POINTER;
template <class Type>
class Node{
public:
Type data;
Node<Type> *prev;
Node<Type> *next;

void operator=(const Node &source)
{     data=source.data;    }

};

private :  int count;
Node<Type> *head;
Node<Type> *tail;
private :
void* GetPointer(int index);

public :
List();
virtual ~List();
int Count();
bool Empty();
void Add(Type &source);  // 맨뒤에 붙이기

//int BinarySearch(Type &source); // 찾기
int Search(Type &source);  // Type이 == 지원해야 합니다.

void Modify(int index,Type &source);  // index위치의 데이터 수정

Type& operator[](int index);  // index번지의 Node의 data반환
Type& GetData(int index);
void DeleteHead();
void DeleteTail();
void Delete(Type &source);
void Delete(int index);
void Insert(int index,Type &source);  // Pointer위치에 레코드 삽입
void Replace(int index,int index2);
void Sort();  // 소팅하기
};
template<class Type>
List<Type>::List()
count=0;
head=NULL;
tail=NULL;
template<class Type>
void* List<Type>::GetPointer(int index)
int i;

Node<Type>* pointer;
pointer=head;
for (i=0;i<index;i++)
pointer=pointer->next;

return (void*)pointer;
template<class Type>
List<Type>::~List()
while(Empty()==false)
Delete(0);
template<class Type>
int List<Type>::Count()
return count;
template<class Type>
bool List<Type>::Empty()
return (count==LINK_EMPTY);
template<class Type>
void List<Type>::Add(Type &source)
Node<Type> *storage;
storage = new Node<Type>;
storage->data=source;  // 데이터 입력

if (head==NULL)
head=storage;
tail=storage;
storage->next=NULL;
storage->prev=NULL;
else
tail->next=storage;
storage->prev=tail;
storage->next=NULL;
tail=storage;
count++;
template<class Type>
int List<Type>::Search(Type &source)
int index;
Node<Type> *SearchPointer;
index = 0;
for (SearchPointer=head;
((SearchPointer->next)!=NULL);
SearchPointer=SearchPointer->next)
{       if (SearchPointer->data==source) return index;
index++;

index=-1;
return index;
template<class Type>
void List<Type>::Modify(int index,Type &source)  // index위치의 데이터 수정
Node<Type> *pointer=head;
pointer=(Node<Type>*)GetPointer(index);
pointer->data=source;
template<class Type>
void List<Type>::DeleteHead()
Node<Type> *tempPointer=head;
if (head!=NULL)
if (head->next!=NULL) head->next->prev=NULL;
head=head->next;

count--;
delete tempPointer;
template<class Type>
void List<Type>::DeleteTail()
Node<Type> *tempPointer=tail;
if (tail!=NULL)
if (tail->prev!=NULL) tail->prev->next=NULL;
tail=tail->prev;
count--;

delete tempPointer;

template<class Type>
void List<Type>::Delete(Type &source)
{      Delete(Search(source));     }
template<class Type>
void List<Type>::Delete(int index)
Node<Type>* pointer;

pointer=(Node<Type>*)GetPointer(index);
if (pointer->prev!=NULL)
pointer->prev->next=pointer->next;   // 링크 이동
else {
head=pointer->next;
if (pointer->next!=NULL)
pointer->next->prev=pointer->prev;
else {
tail=pointer->prev;

delete pointer;  // 메모리 날리기
count--;
template<class Type>
void List<Type>::Insert(int index,Type &source)

Node<Type> *newNode = new Node<Type>;
Node<Type> *pointer = (Node<Type>*) GetPointer(index);
newNode->prev=pointer->prev;
newNode->next=pointer;
if (pointer->prev==NULL)
head=newNode;
else
pointer->prev->next=newNode;

pointer->prev=newNode;
newNode->data=source;

count++;

}// Pointer위치에 레코드 삽입
template<class Type>
void List<Type>::Replace(int index,int index2)
Node<Type> temp;
Node<Type> *pointer1 = (Node<Type>*) GetPointer(index);
Node<Type> *pointer2 = (Node<Type>*) GetPointer(index2);

temp.data=pointer1->data;
pointer1->data=pointer2->data;
pointer2->data=temp.data;
template<class Type>
void List<Type>::Sort()  // 소팅하기
Node<Type> *pointer1;
Node<Type> *pointer2;
int i,j;
for (i=0;i<count;i++)
pointer1=(Node<Type>*)GetPointer(i);
for (j=0;j<count;j++)
pointer2=(Node<Type>*)GetPointer(j);
if (pointer1->data.Compare(pointer2->data)<0)   Replace(i,j);

template<class Type>
Type& List<Type>::operator[](int index)// index번지의 Node반환
int i;

Node<Type>* pointer=head;
for (i=0;i<index;i++)  // pointer를 index위치까지 이동
pointer=pointer->next;
return pointer->data;
template<class Type>
Type& List<Type>::GetData(int index)// index번지의 Node반환
int i;
Node<Type>* pointer=head;

for (i=0;i<index;i++)  // pointer를 index위치까지 이동
pointer=pointer->next;

return pointer->data;

#endif __LINKEDLIST_H

<!-- en -->
/* Stack / Queue / Linked List made with C++ This material was tested in VC++ 6.0. It is implemented with templates, and classes can be managed as stacks, queues, and linked lists. In practice, please create and use stack, queue, and linkedlist as separate header files.
Created in 2003 */
#ifndef __STACK_H
#define __STACK_H
#define STACK_EMPTY -1
/* To use this Stack, class Type must support operator =. */
template <class Type>
class Stack;
template <class Type>
class Stack{
        private : 
                int capacity;   // Data Capacity
                int top;          // Top Counter
                Type *data;               // Data Pointer
        public :
                Stack();
                Stack(int capacity);
                virtual ~Stack();
                void Reset();
                void Push(Type &data);
                Type Pop();
                Type Top();
                void Capacity(int capacity);
                int Capacity();
                bool Empty();
                bool Full();
};
        
template <class Type>
Stack<Type>::Stack()
{
        this->capacity=0;
        this->top=STACK_EMPTY;
        this->data=NULL;
}
template <class Type>
Stack<Type>::Stack(int cap)
{
        this->capacity=cap;
        this->top=STACK_EMPTY;
        this->data=new Type[cap];
}
template <class Type>
Stack<Type>::~Stack()
{
        if ((this->data)!=NULL)
        { 
                delete []this->data;
        }
}
template <class Type>
void Stack<Type>::Reset()
{
        this->top=STACK_EMPTY;
}
template <class Type>
void Stack<Type>::Push(Type &input)
{
        this->top++;
        this->data[this->top]=input; 
}
template <class Type>
Type Stack<Type>::Pop()
{
        Type returnData;
        returnData=this->data[this->top];
        this->top--;
        return returnData;
}
template <class Type>
Type Stack<Type>::Top()
{
        Type returnData;
        returnData=this->data[this->top];
        return returnData;
}
template <class Type>
void Stack<Type>::Capacity(int cap)
{
        if (this-data==NULL)
        {
                this->data=new Type[cap];
        }
}
template <class Type>
int Stack<Type>::Capacity()
{
        return this->capacity;
}
template <class Type>
bool Stack<Type>::Empty()
{
        return ((this->top)==STACK_EMPTY);
}
template <class Type>
bool Stack<Type>::Full()
{
        return ((this->top)==(this->capacity-1));
}

#endif  __STACK_H

#ifndef __QUEUE_H
#define __QUEUE_H
#define QUEUE_EMPTY 0
#include <stdlib.h>
/* To use this Queue, class Type must support operator =. */
template <class Type>
class Queue;
template <class Type>
class Queue{
        private :
                template <class Type>
                class Node{
                public:
                        Type data;
                        Node<Type> *next;
                        
                        void operator=(const Node &source)
                        {
                                data=source.data;
                        }
                };
        
        private : 
                int count;
                Node<Type> *first;
                Node<Type> *rear;
                
        public :
                Queue();
                virtual ~Queue();
                void EnQueue(Type &source);
                Type DeQueue();
                Type Recent();
                Type Last();
                Type Lookup();
                int Count();
                bool Empty();
        
};
template <class Type>
Queue<Type>::Queue()
{
        count=0;
        first=NULL;
        rear=NULL;
}
template <class Type>
Queue<Type>::~Queue()
{
        if (first!=NULL)    
        {
                while(!Empty())    DeQueue();
        }
}
template<class Type>
void Queue<Type>::EnQueue(Type &source)
{
        Node<Type> *storage;
        
        storage = new Node<Type>;  // Storage Create
        storage->data=source;      // data copy
        storage->next=NULL;
        /* Node Link */
        if (Empty())   
        {
                first=storage;    
                rear=storage;
        }
        else 
        {
                rear->next=storage;
                rear=storage;
        }
        count++;
}
template<class Type>
Type Queue<Type>::DeQueue()
{
        Type returnData;   // Data for Return
        Node<Type> *freeNode;    
        returnData=first->data;    // Data Copy
        freeNode=first;   // first Pointer Backup for Delete
        first=first->next;   // first Pointer Moving
        count--;
        
        delete freeNode;  // free old Node
        return returnData;   // return
}
template<class Type>
Type Queue<Type>::Recent()
{       return rear->data;       }

template<class Type>
Type Queue<Type>::Last()
{
        return first->data;
}

template<class Type>
int Queue<Type>::Count()
{
    return count;
}
template<class Type>
bool Queue<Type>::Empty()
{
    return (count==QUEUE_EMPTY);
}
#endif  __QUEUE_H
#ifndef __LINKEDLIST_H
#define __LINKEDLIST_H
#define LINK_EMPTY 0
/* To use this List, class Type must support:
   1) operator =   2) operator ==   3) Compare function. */
template <class Type>
class List;
template <class Type>
class List{
    private :
            typedef enum POINTER {FIRST_POINTER, SECOND_POINTER} POINTER;
            template <class Type>
            class Node{
            public:
                    Type data;
                    Node<Type> *prev;
                    Node<Type> *next;
                    
                    void operator=(const Node &source)
                    {    data=source.data;   }
            
            };
    
    private :  int count;
            Node<Type> *head;
            Node<Type> *tail;
    private :
            void* GetPointer(int index);
    
    public :
            List();
            virtual ~List();
            int Count();
            bool Empty();
            void Add(Type &source);  // Append to the end
            
            //int BinarySearch(Type &source); // Search
            int Search(Type &source);  // Type must support ==
            
            void Modify(int index,Type &source);  // Modify data at index position
            
            Type& operator[](int index);  // Return data of Node at index
            Type& GetData(int index);
            void DeleteHead(); 
            void DeleteTail(); 
            void Delete(Type &source);
            void Delete(int index);
            void Insert(int index,Type &source);  // Insert record at Pointer position
            void Replace(int index,int index2);
            void Sort();  // Sort
};
template<class Type>
List<Type>::List()
{
    count=0;
    head=NULL;
    tail=NULL;
}
template<class Type>
void* List<Type>::GetPointer(int index)
{
    int i;
    
    Node<Type>* pointer;
    pointer=head;
    for (i=0;i<index;i++)
    {
            pointer=pointer->next;
    }
    
    return (void*)pointer;
}
template<class Type>
List<Type>::~List()
{
    while(Empty()==false)
    {
            Delete(0);
    }
}
template<class Type>
int List<Type>::Count()
{
    return count;
}
template<class Type>
bool List<Type>::Empty()
{
    return (count==LINK_EMPTY);
}
template<class Type>
void List<Type>::Add(Type &source)
{
    Node<Type> *storage;
    storage = new Node<Type>;
    storage->data=source;  // Input data 
    
    if (head==NULL)
    {
            head=storage;
            tail=storage;
            storage->next=NULL;
            storage->prev=NULL;
    }
    else
    {       
            tail->next=storage;
            storage->prev=tail;
            storage->next=NULL;
            tail=storage;
    }
    count++; 
}
template<class Type>
int List<Type>::Search(Type &source)
{
    int index;
    Node<Type> *SearchPointer;
    index = 0;
    for (SearchPointer=head;
                    ((SearchPointer->next)!=NULL); 
                                            SearchPointer=SearchPointer->next)
    {       if (SearchPointer->data==source) return index;
            index++;
    }
    
    index=-1;
    return index;
}
template<class Type>
void List<Type>::Modify(int index,Type &source)  // Modify data at index position
{
    Node<Type> *pointer=head;
    pointer=(Node<Type>*)GetPointer(index);
    pointer->data=source;
}
template<class Type>
void List<Type>::DeleteHead()
{
    Node<Type> *tempPointer=head;
    if (head!=NULL)  
    {
    if (head->next!=NULL) head->next->prev=NULL;
    head=head->next;
    
    count--;
    delete tempPointer;
    }
}
template<class Type>
void List<Type>::DeleteTail()
{
    Node<Type> *tempPointer=tail;
    if (tail!=NULL)
    {
            if (tail->prev!=NULL) tail->prev->next=NULL;
            tail=tail->prev;
            count--;
            
            delete tempPointer; 
    }
}

template<class Type>
void List<Type>::Delete(Type &source)
{      Delete(Search(source));     }
template<class Type>
void List<Type>::Delete(int index)
{
        Node<Type>* pointer;
                
        pointer=(Node<Type>*)GetPointer(index);
        if (pointer->prev!=NULL)
        {
                pointer->prev->next=pointer->next;   // Relink
        }
        else {  
                head=pointer->next;
        }
        if (pointer->next!=NULL)
        {
                pointer->next->prev=pointer->prev;
        }
        else {
                tail=pointer->prev;
        }
        
        delete pointer;  // Deallocate memory
        count--;
}
template<class Type>
void List<Type>::Insert(int index,Type &source)
{
        
        Node<Type> *newNode = new Node<Type>;
        Node<Type> *pointer = (Node<Type>*) GetPointer(index);
        newNode->prev=pointer->prev;
        newNode->next=pointer;
        if (pointer->prev==NULL)
        {
                head=newNode;    
        }
        else 
        {
                pointer->prev->next=newNode;
        }
        
        pointer->prev=newNode;
        newNode->data=source;
        
        count++;
        
}// Insert record at Pointer position
template<class Type>
void List<Type>::Replace(int index,int index2)
{
        Node<Type> temp;
        Node<Type> *pointer1 = (Node<Type>*) GetPointer(index);
        Node<Type> *pointer2 = (Node<Type>*) GetPointer(index2);
        
        temp.data=pointer1->data;
        pointer1->data=pointer2->data;
        pointer2->data=temp.data;
}
template<class Type>
void List<Type>::Sort()  // Sort
{
        Node<Type> *pointer1;
        Node<Type> *pointer2;
        int i,j;
        for (i=0;i<count;i++)
        {
                pointer1=(Node<Type>*)GetPointer(i);
                for (j=0;j<count;j++)
                {
                        pointer2=(Node<Type>*)GetPointer(j);
                        if (pointer1->data.Compare(pointer2->data)<0)   Replace(i,j);
                }
        }
}
 
template<class Type>
Type& List<Type>::operator[](int index)// Return Node at index
{
        int i;
        
        Node<Type>* pointer=head;
        for (i=0;i<index;i++)  // Move pointer to index position
        {
                pointer=pointer->next;         
        }
        return pointer->data;
}
template<class Type>
Type& List<Type>::GetData(int index)// Return Node at index
{
        int i;
        Node<Type>* pointer=head;
        
        for (i=0;i<index;i++)  // Move pointer to index position
        {
                pointer=pointer->next;         
        }
        
        return pointer->data;
}

#endif __LINKEDLIST_H