import React from 'react';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

interface Props {
  ticketData: { libraryName: string, books: any, total: number };
}

const ReportDocument: React.FC<Props> = ({ticketData}) => {
  return (
    <Document>
      <Page size="A4">
        <View style={{display: 'flex', flexDirection: 'column', padding:'10px'}}>
          <View style={{ textAlign: 'center', marginTop: 16, marginBottom: 16 }}>
            <Text>{ticketData.libraryName}</Text>
          </View>
         
          <View style={{width: '100%', border: '1px solid black', display: 'flex', flexDirection: 'column'}}>
            <View style={{ width: '100%', display: 'flex', flexDirection: 'row'}}>
              <View style={{width: '42.5%', textAlign: 'center', border: '1px solid black'}}><Text>Nombre</Text></View>
              <View style={{width: '15%', textAlign: 'center', border: '1px solid black'}}><Text>Cantidad</Text></View>
              <View style={{width: '42.5%', textAlign: 'center', border: '1px solid black'}}><Text>Precio</Text></View>
            </View>
            {ticketData.books.map((book: any) => (
            <View style={{ width: '100%', display: 'flex', flexDirection: 'row'}}>
              <View style={{width: '42.5%', textAlign: 'center', border: '1px solid black'}}><Text>{book.book.title}</Text></View>
              <View style={{width: '15%', textAlign: 'center', border: '1px solid black'}}><Text>{book.amount}</Text></View>
              <View style={{width: '42.5%', textAlign: 'center', border: '1px solid black'}}><Text>${book.book.price}</Text></View>
            </View>
            ))}
          </View>
          <View>
            <Text  style={{paddingTop: '10px', fontSize: '25px'}}>Total: ${ticketData.total}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

// Create Document Component
const Ticket: React.FC<Props> = ({
  ticketData,
}) => {
  return (
    <div>
      <PDFDownloadLink document={<ReportDocument ticketData={ticketData}/>} fileName="ticket.pdf">
        Descargar Ticket
      </PDFDownloadLink>
      <ReportDocument ticketData={ticketData}/>
  </div>
  );
};

export default Ticket;